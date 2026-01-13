// region imports
const Inventory = require("../models/inventoryModel");
const mongoose = require("mongoose");
const STATUS_CODE = require("../constants/statusCodes");
const sendResponse = require("../utils/sendResponse");
const {
  fetchInventory,
  fetchInventoryStats,
} = require("../utils/inventoryUtils");
// endregion

// region create inventory
const createInventory = async (req, res) => {
  try {
    const { name, price, quantity, category } = req.body;
    const item = new Inventory({
      name,
      price,
      quantity,
      category,
      createdBy: req.user._id,
    });
    await item.save();
    return sendResponse(
      res,
      STATUS_CODE.CREATED,
      "ok",
      "Inventory item created successfully",
      item
    );
  } catch (err) {
    if (err.name === "ValidationError") {
      return sendResponse(
        res,
        STATUS_CODE.BAD_REQUEST,
        "error",
        Object.values(err.errors)[0].message
      );
    }
    return sendResponse(
      res,
      STATUS_CODE.INTERNAL_SERVER_ERROR,
      "error",
      err?.message || "Failed to create inventory item",
      null,
      "create inventory"
    );
  }
};
// endregion

// region update inventory
const updateInventory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, price, quantity = 0, category = "others" } = req.body;
    const updateData = {};
    if (name !== undefined) updateData.name = name;
    if (price !== undefined) updateData.price = price;
    if (quantity !== undefined) updateData.quantity = quantity;
    if (category !== undefined) updateData.category = category;

    const updated = await Inventory.findOneAndUpdate(
      { _id: id, isDeleted: 0, createdBy: req.user._id },
      { $set: req.body },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!updated) {
      return sendResponse(
        res,
        STATUS_CODE.FORBIDDEN,
        "error",
        "Not allowed to update this inventory item"
      );
    }

    return sendResponse(
      res,
      STATUS_CODE.OK,
      "ok",
      "Inventory item updated successfully",
      updated
    );
  } catch (err) {
    return sendResponse(
      res,
      STATUS_CODE.INTERNAL_SERVER_ERROR,
      "error",
      err?.message || "Failed to update inventory item",
      null,
      "update inventory"
    );
  }
};

// endregion

// region delete inventory
const deleteInventory = async (req, res) => {
  try {
    const { id } = req.params;

    const removed = await Inventory.findOneAndUpdate(
      { _id: id, isDeleted: 0, createdBy: req.user._id },
      { $set: { isDeleted: 1, quantity: 0 } },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!removed) {
      return sendResponse(
        res,
        STATUS_CODE.FORBIDDEN,
        "error",
        "Not allowed to delete this inventory item"
      );
    }

    return sendResponse(
      res,
      STATUS_CODE.OK,
      "ok",
      "Inventory item deleted successfully",
      removed
    );
  } catch (err) {
    return sendResponse(
      res,
      STATUS_CODE.INTERNAL_SERVER_ERROR,
      "error",
      err?.message || "Failed to delete inventory item",
      null,
      "delete inventory"
    );
  }
};
// endregion

// region get all inventory
const getAllInventory = async (req, res) => {
  try {
    const data = await fetchInventory({ ownerId: null, query: req.query });
    return sendResponse(res, STATUS_CODE.OK, "ok", "", data);
  } catch (err) {
    return sendResponse(
      res,
      STATUS_CODE.INTERNAL_SERVER_ERROR,
      "error",
      err?.message || "Failed to fetch inventory items",
      null,
      "get all inventory"
    );
  }
};
// endregion

// region get inventory by id
const getInventoryById = async (req, res) => {
  try {
    const { id } = req.params;
    const item = await Inventory.findOne({ _id: id, isDeleted: 0 }).lean();
    if (!item)
      return sendResponse(
        res,
        STATUS_CODE.NOT_FOUND,
        "error",
        "Inventory item not found"
      );

    return sendResponse(res, STATUS_CODE.OK, "ok", "", item);
  } catch (err) {
    return sendResponse(
      res,
      STATUS_CODE.INTERNAL_SERVER_ERROR,
      "error",
      err?.message || "Failed to fetch inventory item",
      null,
      "get inventory by id"
    );
  }
};
// endregion

// region get current user's inventory
const getMyInventory = async (req, res) => {
  try {
    const data = await fetchInventory({
      ownerId: req.user._id,
      query: req.query,
    });
    return sendResponse(res, STATUS_CODE.OK, "ok", "", data);
  } catch (err) {
    return sendResponse(
      res,
      STATUS_CODE.INTERNAL_SERVER_ERROR,
      "error",
      err?.message || "Failed to fetch inventories for current user",
      null,
      "get inventories for current user"
    );
  }
};
// endregion

// region get inventory by user id (admin)
const getInventoryByUser = async (req, res) => {
  try {
    const userId = req.params.userId;
    const data = await fetchInventory({
      ownerId: new mongoose.Types.ObjectId(userId),
      query: req.query,
    });
    return sendResponse(res, STATUS_CODE.OK, "ok", "", data);
  } catch (err) {
    return sendResponse(
      res,
      STATUS_CODE.INTERNAL_SERVER_ERROR,
      "error",
      err?.message || "Failed to fetch inventories by user id",
      null,
      "get inventories by user id"
    );
  }
};
// endregion

// region stats overall
const getInventoryStats = async (req, res) => {
  try {
    const data = await fetchInventoryStats();
    return sendResponse(res, STATUS_CODE.OK, "ok", "", data);
  } catch (err) {
    return sendResponse(
      res,
      STATUS_CODE.INTERNAL_SERVER_ERROR,
      "error",
      err?.message || "Failed to compute inventory stats",
      null,
      "get inventory stats"
    );
  }
};
// endregion

// region inventory stats from current user
const getMyInventoryStats = async (req, res) => {
  try {
    const ownerId = req.user._id;
    const data = await fetchInventoryStats(ownerId);
    return sendResponse(res, STATUS_CODE.OK, "ok", "", data);
  } catch (err) {
    return sendResponse(
      res,
      STATUS_CODE.INTERNAL_SERVER_ERROR,
      "error",
      err?.message || "Failed to compute my inventory stats",
      null,
      "get my inventory stats"
    );
  }
};
// endregion

// region inventory stats from user
const getInventoryByUserStats = async (req, res) => {
  try {
    const userId = req.params.userId;
    const data = await fetchInventoryStats(new mongoose.Types.ObjectId(userId));
    return sendResponse(res, STATUS_CODE.OK, "ok", "", data);
  } catch (err) {
    return sendResponse(
      res,
      STATUS_CODE.INTERNAL_SERVER_ERROR,
      "error",
      err?.message || "Failed to compute inventory stats for user",
      null,
      "get inventory by user stats"
    );
  }
};
// endregion

module.exports = {
  createInventory,
  updateInventory,
  deleteInventory,
  getAllInventory,
  getInventoryById,
  getMyInventory,
  getInventoryByUser,
  getInventoryStats,
  getMyInventoryStats,
  getInventoryByUserStats,
};
