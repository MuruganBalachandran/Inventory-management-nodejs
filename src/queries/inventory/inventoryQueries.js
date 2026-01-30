// region model imports
const Inventory = require('../../models/inventory/inventoryModel');
const mongoose = require('mongoose');
// endregion

// region helpers
// Convert string to ObjectId safely
const toObjectId = (id = '') => (id ? new mongoose.Types.ObjectId(id) : id);

// Default pagination limits
const DEFAULT_LIMIT = 20;
const MAX_LIMIT = 100;
// endregion

// region create inventory item
const createInventoryItem = async (itemData = {}) => {
  try {
    // extract values with defaults
    const {
      Name = '',
      Price = 0,
      Quantity = 0,
      Category = 'others',
      Created_By = null,
    } = itemData;

    // current timestamp for manual Created_At and Updated_At
    const now = new Date();

    // create new inventory document
    const item = new Inventory({
      Name,
      Price,
      Quantity,
      Category,
      Created_By,
      Created_At: now,   // manual creation timestamp
      Updated_At: now,   // manual update timestamp
      Is_Deleted: false, // active by default
    });

    // save to database
    await item.save();

    return item ?? null;
  } catch (err) {
    console.error('Error creating inventory item:', err);
    throw err;
  }
};
// endregion

// region find inventory by ID
const findInventoryById = async (itemId = '') => {
  try {
    // build filter only for active items
    const filter = { _id: toObjectId(itemId), Is_Deleted: false };

    // aggregation pipeline with user lookup
    const pipeline = [
      { $match: filter },
      {
        $lookup: {
          from: 'users',
          localField: 'Created_By',
          foreignField: '_id',
          as: 'Created_By',
        },
      },
      { $unwind: { path: '$Created_By', preserveNullAndEmptyArrays: true } },
      {
        $project: {
          Name: 1,
          Price: 1,
          Quantity: 1,
          Category: 1,
          Created_At: 1,
          Updated_At: 1,
          'Created_By._id': 1,
          'Created_By.Name': 1,
          'Created_By.Email': 1,
          'Created_By.Role': 1,
          'Created_By.Age': 1,
          'Created_By.Created_At': 1,
          'Created_By.Updated_At': 1,
        },
      },
    ];

    // execute aggregation and get first result
    const [item] = await Inventory.aggregate(pipeline).allowDiskUse(true);
    return item ?? null;
  } catch (err) {
    console.error('Error finding inventory item by ID:', err);
    throw err;
  }
};
// endregion

// region get all inventory items
const getAllInventoryItems = async (options = {}) => {
  try {
    const { ownerId = null, query = {} } = options;

    // convert ownerId to ObjectId safely
    const userId = toObjectId(ownerId);

    // pagination setup
    let skip = Number(query?.skip) || 0;
    let limit = Number(query?.limit) || DEFAULT_LIMIT;
    skip = skip < 0 || !Number.isInteger(skip) ? 0 : skip;
    limit = limit < 1 || !Number.isInteger(limit) ? DEFAULT_LIMIT : Math.min(limit, MAX_LIMIT);

    // build filter dynamically
    const filter = { Is_Deleted: false };
    if (userId) filter.Created_By = userId;
    if (query?.category) filter.Category = query.category;
    if (query?.name) filter.Name = { $regex: query.name, $options: 'i' };

    // aggregation pipeline
    const pipeline = [
      { $match: filter },
      { $sort: { Created_At: -1 } },
      {
        $lookup: {
          from: 'users',
          localField: 'Created_By',
          foreignField: '_id',
          as: 'Created_By',
        },
      },
      { $unwind: { path: '$Created_By', preserveNullAndEmptyArrays: true } },
      {
        $project: {
          Name: 1,
          Price: 1,
          Quantity: 1,
          Category: 1,
          Created_At: 1,
          Updated_At: 1,
          'Created_By._id': 1,
          'Created_By.Name': 1,
          'Created_By.Email': 1,
          'Created_By.Role': 1,
          'Created_By.Age': 1,
          'Created_By.Created_At': 1,
          'Created_By.Updated_At': 1,
        },
      },
      { $skip: skip },
      { $limit: limit },
    ];

    // execute query
    const items = await Inventory.aggregate(pipeline).allowDiskUse(true);
    const count = await Inventory.countDocuments(filter);

    const totalPages = Math.ceil(count / limit);
    const currentPage = Math.floor(skip / limit) + 1;

    // return items with pagination metadata
    return {
      items,
      pagination: {
        total: count,
        count: items.length,
        skip,
        limit,
        currentPage,
        totalPages,
        hasNext: currentPage < totalPages,
        hasPrev: currentPage > 1,
      },
    };
  } catch (err) {
    console.error('Error fetching inventory items:', err);
    throw err;
  }
};
// endregion

// region update inventory item
const updateInventoryItem = async (itemId = '', userId = '', updateData = {}, isAdmin = false) => {
  try {
    // only allow PascalCase fields
    const allowedFields = ['Name', 'Price', 'Quantity', 'Category'];
    const updateFields = {};

    // iterate allowed fields and copy if provided
    allowedFields.forEach((key) => {
      if (updateData[key] !== undefined) updateFields[key] = updateData[key];
    });

    // always update Updated_At manually
    updateFields.Updated_At = new Date();

    // filter for active items; admin can bypass owner restriction
    const filter = isAdmin
      ? { _id: toObjectId(itemId), Is_Deleted: false }
      : { _id: toObjectId(itemId), Is_Deleted: false, Created_By: toObjectId(userId) };

    // update document and return updated item
    const updated = await Inventory.findOneAndUpdate(
      filter,
      { $set: updateFields },
      { new: true, runValidators: true }
    ).lean();

    return updated ?? null;
  } catch (err) {
    console.error('Error updating inventory item:', err);
    throw err;
  }
};
// endregion

// region delete inventory item
const deleteInventoryItem = async (itemId = '', userId = '', isAdmin = false) => {
  try {
    // filter for active items; admin can bypass owner restriction
    const filter = isAdmin
      ? { _id: toObjectId(itemId), Is_Deleted: false }
      : { _id: toObjectId(itemId), Is_Deleted: false, Created_By: toObjectId(userId) };

    // soft delete item and set Quantity to 0
    const removed = await Inventory.findOneAndUpdate(
      filter,
      { $set: { Is_Deleted: true, Quantity: 0, Updated_At: new Date() } },
      { new: true, runValidators: true }
    ).lean();

    return removed ?? null;
  } catch (err) {
    console.error('Error deleting inventory item:', err);
    throw err;
  }
};
// endregion

// region exports
module.exports = {
  createInventoryItem,
  findInventoryById,
  getAllInventoryItems,
  updateInventoryItem,
  deleteInventoryItem,
};
// endregion


// TODO: pagination , page number 