// region imports
// model imports
const Inventory = require('../models/inventoryModel');


//  utils imports
const { fetchInventory } = require('../utils');
// endregion

// region create inventory item query
const createInventoryItem = async (itemData = {}) => {
  try {
    const {
      name = '',
      price = 0,
      quantity = 0,
      category = 'others',
      createdBy = null,
    } = itemData;

    const item = new Inventory({
      name,
      price,
      quantity,
      category,
      createdBy,
    });

    await item.save();

    return item ?? null;
  } catch (err) {
    console.error('Error creating inventory item:', err);
    throw err;
  }
};
// endregion

// region find inventory by id query (optimized single DB hit using aggregation)
const mongoose = require('mongoose');

const findInventoryById = async (itemId = '') => {
  try {
  
    const filter = { _id: new mongoose.Types.ObjectId(itemId), isDeleted: 0 };

    const pipeline = [
      // find by the filters
      { $match: filter },
      {
        // run parellel execution
        $lookup: {
          from: 'users',
          localField: 'createdBy',
          foreignField: '_id',
          as: 'createdBy',
        },
      },
      { $unwind: { path: '$createdBy', preserveNullAndEmptyArrays: true } },
      {
        // select / remove fields to show
        $project: {
          isDeleted: 0,
          __v: 0,
          'createdBy.password': 0,
          'createdBy.tokens': 0,
          'createdBy.isDeleted': 0,
          'createdBy.__v': 0,
        },
      },
      { $limit: 1 },
    ];

    const [item] = await Inventory.aggregate(pipeline);
    return item ?? null;
  } catch (err) {
    console.error('Error finding inventory item by ID:', err);
    throw err;
  }
};

// endregion


// region get all inventory items query
const getAllInventoryItems = async (queryOptions = {}) => {
  try {
    const { ownerId = null, query = {}, populateUser = false } = queryOptions;

    const mongoose = require('mongoose');
    const userId =
      ownerId && typeof ownerId === 'string'
        ? new mongoose.Types.ObjectId(ownerId)
        : ownerId;

    // fetch inventory ( with count + items)
    const { items, pagination } = await fetchInventory({
      ownerId: userId,
      query,
      populateUser,
    });

    return {
      items: items ?? [],
      pagination,
    };
  } catch (err) {
    console.error('Error fetching all inventory items:', err);
    throw err;
  }
};
// endregion


/// region update inventory item query
const updateInventoryItem = async (
  itemId = '',
  userId = '',
  updateData = {},
  isAdmin = false
) => {
  try {
    // Build update object only with defined fields
    const updateFields = {};
    ['name', 'price', 'quantity', 'category'].forEach((key) => {
      if (updateData[key] !== undefined) updateFields[key] = updateData[key];
    });

    // Build filter based on admin or owner
    const filter = isAdmin
      ? { _id: itemId, isDeleted: 0 }
      : { _id: itemId, isDeleted: 0, createdBy: userId };

    // Perform atomic update and return plain object
    const updated = await Inventory.findOneAndUpdate(
      filter,
      { $set: updateFields },
      {
        new: true,           // return updated doc
        runValidators: true, // validate before update
      }
    )  
      .lean(); // return plain JS object (faster)

    return updated ?? null;
  } catch (err) {
    console.error('Error updating inventory item:', err);
    throw err;
  }
};
// endregion


// region delete inventory item query
const deleteInventoryItem = async (itemId = '', userId = '', isAdmin = false) => {
  try {
    // Build filter based on admin or owner
    const filter = isAdmin
      ? { _id: itemId, isDeleted: 0 }
      : { _id: itemId, isDeleted: 0, createdBy: userId };

    // Perform atomic soft delete and return plain object
    const removed = await Inventory.findOneAndUpdate(
      filter,
      { $set: { isDeleted: 1, quantity: 0 } },
      {
        new: true,           // return updated doc
        runValidators: true, // validate before update
      }
    )
      .lean(); // return plain JS object

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
