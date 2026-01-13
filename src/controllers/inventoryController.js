// region imports
const Inventory = require("../models/inventoryModel");
const mongoose = require("mongoose");
<<<<<<< HEAD
const STATUS_CODE = require("../constants/statusCodes");
const sendResponse = require("../utils/sendResponse");
const {
  fetchInventory,
  fetchInventoryStats,
} = require("../utils/inventoryUtils");
=======
>>>>>>> 444f163a5ca72f883d3a71eaa4076d959c28b34b
// endregion

// region create inventory
const createInventory = async (req, res) => {
  try {
<<<<<<< HEAD
    const { name, price, quantity, category } = req.body;
=======
    const name = req.body.name?.trim();
    const price = req.body.price;
    const quantity = req.body.quantity ?? 0;
    const category = req.body.category?.trim() || "others";

    if (!name) {
      return res.status(400).send({ message: "Name required" });
    }

>>>>>>> 444f163a5ca72f883d3a71eaa4076d959c28b34b
    const item = new Inventory({
      name,
      price,
      quantity,
      category,
      createdBy: req.user._id,
    });
<<<<<<< HEAD
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
=======

    await item.save();

    res.status(201).send({
      message: "Inventory item created successfully",
      item: item.toObject(),
    });
  } catch (err) {
    console.error("create inventory error:", err);
    res.status(500).send({ message: "Failed to create inventory item" });
>>>>>>> 444f163a5ca72f883d3a71eaa4076d959c28b34b
  }
};
// endregion

// region get all inventory
const getAllInventory = async (req, res) => {
  try {
<<<<<<< HEAD
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
=======
    const skip = Number(req.query?.skip) || 0;
    const limit = Math.min(Number(req.query?.limit) || 20, 100);

    const filter = { isDeleted: 0 };
    if (req.query?.category) {
      filter.category = req.query.category;
    }
    if (req.query.name) {
      filter.name = { $regex: req.query.name, $options: "i" };
    }

    const [count, items] = await Promise.all([
      Inventory.countDocuments(filter),
      Inventory.find(filter)
        .select({ _id: 1, name: 1, price: 1, quantity: 1, category: 1, createdAt: 1 })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
    ]);

    res.send({ count: count || 0, items: items || [], skip, limit });
  } catch (err) {
    console.error("get all inventory error:", err);
    res.status(500).send({ message: "Failed to fetch inventory items" });
>>>>>>> 444f163a5ca72f883d3a71eaa4076d959c28b34b
  }
};
// endregion

// region get inventory by id
const getInventoryById = async (req, res) => {
  try {
<<<<<<< HEAD
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
=======
    const id = req.params?.id;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).send({ message: "Invalid inventory ID" });
    }

    const item = await Inventory.findOne({ _id: id, isDeleted: 0 })
      .select({ _id: 1, name: 1, price: 1, quantity: 1, category: 1, createdAt: 1, createdBy: 1 })
      .lean();
    if (!item) {
      return res.status(404).send({ message: "Inventory item not found" });
    }

    res.send({ item });
  } catch (err) {
    console.error("get inventory by id error:", err);
    res.status(500).send({ message: "Failed to fetch inventory item" });
  }
};
// endregion

// region update inventory
const updateInventory = async (req, res) => {
  try {
    const id = req.params?.id;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).send({ message: "Invalid inventory ID" });
    }

    const updates = {};
    const fields = ["name", "price", "quantity", "category"];

    fields?.forEach((field) => {
      if (req?.body?.[field] !== undefined) {
        updates[field] =
          typeof req?.body?.[field] === "string"
            ? req?.body?.[field]?.trim()
            : req?.body?.[field];
      }
    });

    if (!Object?.keys(updates).length) {
      return res.status(400).send({ message: "No valid fields to update" });
    }

    //  Prepare owner-aware filter for atomic update
    const filter = { _id: id, isDeleted: 0 };
    if (req?.user?.role !== "admin") {
      if (!req?.user?._id) {
        return res.status(403).send({ message: "Not allowed" });
      }
      filter.createdBy = req.user._id;
    }

    // perform atomic update
    const projection = { _id: 1, name: 1, price: 1, quantity: 1, category: 1, createdAt: 1, createdBy: 1 };
    const updated = await Inventory.findOneAndUpdate(
      filter,
      { $set: updates },
      { new: true, runValidators: true }
    )
      .select(projection)
      .lean();


    if (!updated) {
      return res.status(400).send({ message: "Failed to update inventory item" });
    }

    res.send({ message: "Inventory item updated successfully", item: updated });
  } catch (err) {
    console.error("update inventory error:", err);
    res.status(400).send({
      message: err?.message || "Failed to update inventory item",
    });
  }
};
// endregion

// region delete inventory
const deleteInventory = async (req, res) => {
  try {
    const id = req?.params?.id;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).send({ message: "Invalid inventory ID" });
    }

    //  Build owner-aware filter for atomic soft-delete
    const filter = { _id: id, isDeleted: 0 };

    const projection = { _id: 1, name: 1, price: 1, quantity: 1, category: 1, createdAt: 1, createdBy: 1 };
    const removed = await Inventory.findOneAndUpdate(filter, { $set: { isDeleted: 1 } }, { new: true })
      .select(projection)
      .lean();

    if (!removed) {
      return res.status(400).send({ message: "Failed to delete inventory item" });
    }

    res.send({ message: "Inventory item deleted successfully", item: removed });
  } catch (err) {
    console.error("delete inventory error:", err);
    res.status(500).send({ message: "Failed to delete inventory item" });
>>>>>>> 444f163a5ca72f883d3a71eaa4076d959c28b34b
  }
};
// endregion

// region get current user's inventory
const getMyInventory = async (req, res) => {
  try {
<<<<<<< HEAD
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
=======
    const skip = Number(req?.query?.skip) || 0;
    const limit = Math.min(Number(req?.query?.limit) || 20, 100);

    const filter = { isDeleted: 0, createdBy: req?.user?._id };
    if (req.query?.category) {
      filter.category = req.query.category;
    }
    if (req.query.name) {
      filter.name = { $regex: req.query.name, $options: "i" };
    }

    const [count, items] = await Promise.all([
      Inventory.countDocuments(filter),
      Inventory.find(filter)
        .select({ _id: 1, name: 1, price: 1, quantity: 1, category: 1, createdAt: 1 })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
    ]);

    res.send({ count: count || 0, items: items || [], skip, limit });
  } catch (err) {
    console.error("get my inventory error:", err);
    res.status(500).send({ message: "Failed to fetch inventory items" });
>>>>>>> 444f163a5ca72f883d3a71eaa4076d959c28b34b
  }
};
// endregion

<<<<<<< HEAD
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
=======
// region get inventory by user id (admin or owner)
const getInventoryByUser = async (req, res) => {
  try {
    const userId = req.params?.userId;
    if (!mongoose.Types.ObjectId.isValid(userId)) return res.status(400).send({ message: "Invalid user ID" });

    // allow admin or the user themselves
    if (req.user?.role !== "admin" && !(req.user?._id?.equals(userId))) {
      return res.status(403).send({ message: "Not allowed" });
    }

    const skip = Number(req.query?.skip) || 0;
    const limit = Math.min(Number(req.query?.limit) || 20, 100);

    const filter = { isDeleted: 0, createdBy: mongoose.Types.ObjectId(userId) };
    if (req.query?.category) {
      filter.category = req.query.category;
    }
    if (req.query.name) {
      filter.name = { $regex: req.query.name, $options: "i" };
    }

    const [count, items] = await Promise.all([
      Inventory.countDocuments(filter),
      Inventory.find(filter)
        .select({ _id: 1, name: 1, price: 1, quantity: 1, category: 1, createdAt: 1 })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
    ]);

    res.send({ count: count || 0, items: items || [], skip, limit });
  } catch (err) {
    console.error("get inventory by user error:", err);
    res.status(500).send({ message: "Failed to fetch inventory items" });
>>>>>>> 444f163a5ca72f883d3a71eaa4076d959c28b34b
  }
};
// endregion

<<<<<<< HEAD
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
=======
// region stats via aggregation
const getInventoryStats = async (req, res) => {
  try {
    // admin-only
    if (req.user?.role !== "admin") {
      return res.status(403).send({ message: "Not allowed" });
    }

    const pipeline = [
      { $match: { isDeleted: 0 } },
      {
        $facet: {
          byCategory: [
            {
              $group: {
                _id: "$category",
                count: { $sum: 1 },
                totalValue: { $sum: { $multiply: ["$price", "$quantity"] } },
                avgPrice: { $avg: "$price" },
                minPrice: { $min: "$price" },
                maxPrice: { $max: "$price" }
              }
            },
            { $project: { _id: 0, category: "$_id", count: 1, totalValue: 1, avgPrice: 1, minPrice: 1, maxPrice: 1 } },
            { $sort: { totalValue: -1 } }
          ],
          overall: [
            {
              $group: {
                _id: null,
                count: { $sum: 1 },
                totalValue: { $sum: { $multiply: ["$price", "$quantity"] } },
                avgPrice: { $avg: "$price" },
                minPrice: { $min: "$price" },
                maxPrice: { $max: "$price" }
              }
            },
            { $project: { _id: 0, count: 1, totalValue: 1, avgPrice: 1, minPrice: 1, maxPrice: 1 } }
          ]
        }
      }
    ];

    const [result] = await Inventory.aggregate(pipeline);
    const overall = result?.overall?.[0] || { count: 0, totalValue: 0, avgPrice: 0, minPrice: 0, maxPrice: 0 };
    const byCategory = result?.byCategory || [];

    res.send({ overall, byCategory });
  } catch (err) {
    console.error("get inventory stats error:", err);
    res.status(500).send({ message: "Failed to compute inventory stats" });
  }
};

const getMyInventoryStats = async (req, res) => {
  try {
    const ownerId = req.user?._id;
    if (!ownerId) return res.status(403).send({ message: "Not allowed" });

    const pipeline = [
      { $match: { isDeleted: 0, createdBy: ownerId } },
      {
        $facet: {
          byCategory: [
            {
              $group: {
                _id: "$category",
                count: { $sum: 1 },
                totalValue: { $sum: { $multiply: ["$price", "$quantity"] } },
                avgPrice: { $avg: "$price" },
                minPrice: { $min: "$price" },
                maxPrice: { $max: "$price" }
              }
            },
            { $project: { _id: 0, category: "$_id", count: 1, totalValue: 1, avgPrice: 1, minPrice: 1, maxPrice: 1 } },
            { $sort: { totalValue: -1 } }
          ],
          overall: [
            {
              $group: {
                _id: null,
                count: { $sum: 1 },
                totalValue: { $sum: { $multiply: ["$price", "$quantity"] } },
                avgPrice: { $avg: "$price" },
                minPrice: { $min: "$price" },
                maxPrice: { $max: "$price" }
              }
            },
            { $project: { _id: 0, count: 1, totalValue: 1, avgPrice: 1, minPrice: 1, maxPrice: 1 } }
          ]
        }
      }
    ];

    const [result] = await Inventory.aggregate(pipeline);
    const overall = result?.overall?.[0] || { count: 0, totalValue: 0, avgPrice: 0, minPrice: 0, maxPrice: 0 };
    const byCategory = result?.byCategory || [];

    res.send({ overall, byCategory });
  } catch (err) {
    console.error("get my inventory stats error:", err);
    res.status(500).send({ message: "Failed to compute my inventory stats" });
  }
};

const getInventoryByUserStats = async (req, res) => {
  try {
    const userId = req.params?.userId;
    if (!mongoose.Types.ObjectId.isValid(userId)) return res.status(400).send({ message: "Invalid user ID" });

    // allow admin or the user themselves
    if (req.user?.role !== "admin" && !(req.user?._id?.equals(userId))) {
      return res.status(403).send({ message: "Not allowed" });
    }

    const pipeline = [
      { $match: { isDeleted: 0, createdBy: mongoose.Types.ObjectId(userId) } },
      {
        $facet: {
          byCategory: [
            {
              $group: {
                _id: "$category",
                count: { $sum: 1 },
                totalValue: { $sum: { $multiply: ["$price", "$quantity"] } },
                avgPrice: { $avg: "$price" },
                minPrice: { $min: "$price" },
                maxPrice: { $max: "$price" }
              }
            },
            { $project: { _id: 0, category: "$_id", count: 1, totalValue: 1, avgPrice: 1, minPrice: 1, maxPrice: 1 } },
            { $sort: { totalValue: -1 } }
          ],
          overall: [
            {
              $group: {
                _id: null,
                count: { $sum: 1 },
                totalValue: { $sum: { $multiply: ["$price", "$quantity"] } },
                avgPrice: { $avg: "$price" },
                minPrice: { $min: "$price" },
                maxPrice: { $max: "$price" }
              }
            },
            { $project: { _id: 0, count: 1, totalValue: 1, avgPrice: 1, minPrice: 1, maxPrice: 1 } }
          ]
        }
      }
    ];

    const [result] = await Inventory.aggregate(pipeline);
    const overall = result?.overall?.[0] || { count: 0, totalValue: 0, avgPrice: 0, minPrice: 0, maxPrice: 0 };
    const byCategory = result?.byCategory || [];

    res.send({ overall, byCategory });
  } catch (err) {
    console.error("get inventory by user stats error:", err);
    res.status(500).send({ message: "Failed to compute inventory stats for user" });
>>>>>>> 444f163a5ca72f883d3a71eaa4076d959c28b34b
  }
};
// endregion

<<<<<<< HEAD
module.exports = {
  createInventory,
  updateInventory,
  deleteInventory,
  getAllInventory,
  getInventoryById,
  getMyInventory,
  getInventoryByUser,
=======
// region exports
module.exports = {
  createInventory,
  getAllInventory,
  getMyInventory,
  getInventoryByUser,
  getInventoryById,
  updateInventory,
  deleteInventory,
>>>>>>> 444f163a5ca72f883d3a71eaa4076d959c28b34b
  getInventoryStats,
  getMyInventoryStats,
  getInventoryByUserStats,
};
<<<<<<< HEAD
=======
// endregion
>>>>>>> 444f163a5ca72f883d3a71eaa4076d959c28b34b
