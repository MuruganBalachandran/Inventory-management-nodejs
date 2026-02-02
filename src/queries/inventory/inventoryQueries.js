// region model imports
const Inventory = require('../../models/inventory/inventoryModel');
const mongoose = require('mongoose');
const { getFormattedDateTime, toObjectId } = require('../../utils/common/commonFunctions');
// endregion

// region constants
const DEFAULT_LIMIT = 20;
const MAX_LIMIT = 100;
// endregion

// region create inventory item
/**
 * Persistence layer: Creates a new inventory item.
 * @param {Object} itemData - Item details (Name, Price, etc.).
 * @returns {Promise<Object>} The saved Inventory document.
 */
const createInventoryItem = async (itemData = {}) => {
  try {
    // extract values with defaults
    const {
      Name = '',
      Price = 0,
      Quantity = 0,
      Category = 'others',
      Created_By = null,
    } = itemData ?? {};

    // create new inventory document
    const item = new Inventory({
      Name,
      Price,
      Quantity,
      Category,
      Created_By,
      Created_At: getFormattedDateTime() || new Date().toISOString(),   // manual creation timestamp
      Updated_At: getFormattedDateTime() || new Date().toISOString(),   // manual update timestamp
      Is_Deleted: false, // active by default
    });

    // save to database - Mongoose model call, no ?.
    await item.save();

    return item;
  } catch (err) {
    console.error('Error creating inventory item:', err);
    throw err;
  }
};
// endregion

// region find inventory by ID
/**
 * Fetches a single active inventory item by its ID.
 * Populates User details for the creator.
 */
const findInventoryById = async (itemId = '') => {
  try {
    // build filter only for active items
    const id = toObjectId(itemId) || itemId;
    const filter = { _id: id, Is_Deleted: false };

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

    // execute aggregation - Mongoose model call, no ?.
    const results = await Inventory.aggregate(pipeline).allowDiskUse(true);
    const item = results?.[0] || null;
    
    return item;
  } catch (err) {
    console.error('Error finding inventory item by ID:', err);
    throw err;
  }
};
// endregion

// region get all inventory items
/**
 * Fetches multiple inventory items with full filtering and pagination.
 */
const getAllInventoryItems = async (options = {}) => {
  try {
    const { ownerId = null, query = {}, populateUser = false } = options ?? {};

    // convert ownerId to ObjectId safely
    const userId = toObjectId(ownerId) || ownerId;

    // pagination setup
    let page = Math.max(1, Number(query?.page) || 1);
    let limit = Number(query?.limit) || DEFAULT_LIMIT;
    limit = (limit < 1 || !Number?.isInteger?.(limit)) ? DEFAULT_LIMIT : Math.min(limit, MAX_LIMIT);
    const skip = (page - 1) * limit;

    // build filter dynamically
    const filter = { Is_Deleted: false };
    if (userId) filter.Created_By = userId;
    if (query?.category) filter.Category = query?.category;

    // price range filtering
    if (query?.minPrice || query?.maxPrice) {
      filter.Price = {};
      if (query?.minPrice) filter.Price.$gte = Number(query?.minPrice);
      if (query?.maxPrice) filter.Price.$lte = Number(query?.maxPrice);
    }

    // search filtering (Regex is safer for local dev without index sync)
    if (query?.name) {
      filter.Name = { $regex: query?.name, $options: 'i' };
    }

    // dynamic sorting
    let sort = {};
    const sortField = query?.sortBy || 'Created_At';
    const sortOrder = query?.sortOrder === 'asc' ? 1 : -1;
    sort = { [sortField]: sortOrder };

    // aggregation pipeline
    const pipeline = [
      { $match: filter },
      { $sort: sort },
      {
        $facet: {
          // branch for paginated data
          metadata: [{ $count: 'total' }],
          data: [
            { $skip: skip },
            { $limit: limit },
            // Conditionally join user data
            ...(populateUser ? [
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
            ] : [
              {
                $project: {
                  Name: 1,
                  Price: 1,
                  Quantity: 1,
                  Category: 1,
                  Created_By: 1,
                  Created_At: 1,
                  Updated_At: 1,
                }
              }
            ]),
          ],
        },
      },
    ];

    // execute single aggregation query - Mongoose model call, no ?.
    const results = await Inventory.aggregate(pipeline).allowDiskUse(true);
    const result = results?.[0] || {};

    const items = result?.data || [];
    const count = result?.metadata?.[0]?.total || 0;

    const totalPages = Math.ceil(count / limit);
    const currentPage = Math.floor(skip / limit) + 1;

    // return items with pagination metadata
    return {
      items,
      pagination: {
        total: count,
        count: items?.length,
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
/**
 * Persistence layer: Updates an inventory item.
 */
const updateInventoryItem = async (itemId = '', userId = '', updateData = {}, isPrivileged = false) => {
  try {
    // only allow PascalCase fields
    const allowedFields = ['Name', 'Price', 'Quantity', 'Category'];
    const updateFields = {};

    // iterate allowed fields and copy if provided
    allowedFields.forEach((key) => {
      if (updateData?.[key] !== undefined) updateFields[key] = updateData?.[key];
    });

    // always update Updated_At manually
    updateFields.Updated_At = getFormattedDateTime() || new Date().toISOString();

    // filter for active items; admin can bypass owner restriction
    const itemObjectId = toObjectId(itemId) || itemId;
    const userObjectId = toObjectId(userId) || userId;

    const filter = isPrivileged
      ? { _id: itemObjectId, Is_Deleted: false }
      : { _id: itemObjectId, Is_Deleted: false, Created_By: userObjectId };

    // update document and return updated item - Mongoose model call, no ?.
    const updated = await Inventory.findOneAndUpdate(
      filter,
      { $set: updateFields },
      { new: true, runValidators: true }
    ).lean();

    return updated;
  } catch (err) {
    console.error('Error updating inventory item:', err);
    throw err;
  }
};
// endregion

// region delete inventory item
/**
 * Persistence layer: Soft-deletes an inventory item.
 */
const deleteInventoryItem = async (itemId = '', userId = '', isPrivileged = false) => {
  try {
    // filter for active items; admin can bypass owner restriction
    const itemObjectId = toObjectId(itemId) || itemId;
    const userObjectId = toObjectId(userId) || userId;

    const filter = isPrivileged
      ? { _id: itemObjectId, Is_Deleted: false }
      : { _id: itemObjectId, Is_Deleted: false, Created_By: userObjectId };

    // soft delete item and set Quantity to 0 - Mongoose model call, no ?.
    const removed = await Inventory.findOneAndUpdate(
      filter,
      { $set: { Is_Deleted: true, Quantity: 0, Updated_At: getFormattedDateTime() || new Date().toISOString() } },
      { new: true, runValidators: true }
    ).lean();

    return removed;
  } catch (err) {
    console.error('Error deleting inventory item:', err);
    throw err;
  }
};
// endregion

// region get inventory items by user
/**
 * Lists items filtered by a creator ID.
 */
const getInventoryItemsByUser = async (userId = '', query = {}) => {
    return getAllInventoryItems({ ownerId: userId, query, populateUser: false });
};
// endregion

// region exports
module.exports = {
  createInventoryItem,
  findInventoryById,
  getAllInventoryItems,
  updateInventoryItem,
  deleteInventoryItem,
  getInventoryItemsByUser,
};
// endregion