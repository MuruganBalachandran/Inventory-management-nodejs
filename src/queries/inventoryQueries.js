// region model imports
const Inventory = require('../models/inventoryModel');
// endregion

// region utils imports
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

// region find inventory by id query
const findInventoryById = async (itemId = '') => {
    try {
        const item = await Inventory.findOne({
            _id: itemId,
            isDeleted: 0,
        })
            .populate('createdBy', 'name email')
            .lean();

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
        const {
            ownerId = null,
            query = {},
            populateUser = false,
        } = queryOptions;

        const mongoose = require('mongoose');

        const userId = ownerId && typeof ownerId === 'string' ?
            new mongoose.Types.ObjectId(ownerId) :
            ownerId;

        const paginationData = await fetchInventory({
            ownerId: userId,
            query,
            populateUser,
        });

        // Calculate pagination metadata
        const { count, items, skip, limit } = paginationData;
        const totalPages = Math.ceil(count / limit);
        const currentPage = Math.floor(skip / limit) + 1;

        return {
            items: items ?? [],
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
        console.error('Error fetching all inventory items:', err);
        throw err;
    }
};
// endregion

// region update inventory item query
const updateInventoryItem = async (itemId = '', userId = '', updateData = {}, isAdmin = false) => {
    try {
        const { name, price, quantity = 0, category = 'others' } = updateData;

        const updateFields = {};

        if (name !== undefined) updateFields.name = name;
        if (price !== undefined) updateFields.price = price;
        if (quantity !== undefined) updateFields.quantity = quantity;
        if (category !== undefined) updateFields.category = category;

        const filter = isAdmin
            ? { _id: itemId, isDeleted: 0 }
            : { _id: itemId, isDeleted: 0, createdBy: userId };

        const updated = await Inventory.findOneAndUpdate(
            filter,
            { $set: updateFields },
            {
                new: true,
                runValidators: true,
            }
        );

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
        const filter = isAdmin
            ? { _id: itemId, isDeleted: 0 }
            : { _id: itemId, isDeleted: 0, createdBy: userId };

        const removed = await Inventory.findOneAndUpdate(
            filter,
            { $set: { isDeleted: 1, quantity: 0 } },
            {
                new: true,
                runValidators: true,
            }
        );

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
