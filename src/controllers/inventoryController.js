// region imports
const Inventory = require("../models/inventoryModel");
const mongoose = require("mongoose");
// endregion

// region create inventory
const createInventory = async (req, res) => {
  try {
    const name = req?.body?.name?.trim();
    const price = req?.body?.price;
    const quantity = req?.body?.quantity ?? 0;
    const category = req?.body?.category?.trim() || "others";

    if (!name) {
      return res.status(400).send({ message: "Name required" });
    }

    if (price < 0) {
      return res.status(400).send({ message: "Price cannot be negative" });
    }

    const item = new Inventory({
      name,
      price,
      quantity,
      category,
      createdBy: req?.user?._id,
    });
    await item?.save();

    res.status(201).send({
      message: "Inventory item created successfully",
      item: item?.toObject(),
    });
  } catch (err) {
    console.error("create inventory error:", err);
    res.status(500).send({ message: "Failed to create inventory item" });
  }
};
// endregion

// region get all inventory
const getAllInventory = async (req, res) => {
  try {
    const skip = Number(req?.query?.skip) || 0;
    const limit = Number(req?.query?.limit) || 20;

    const result = await Inventory?.aggregate([
      { $match: { isDeleted: 0 } },
      { $sort: { createdAt: -1 } },
      {
        $facet: {
          items: [
            { $skip: skip },
            { $limit: limit },
            {
              $project: {
                name: 1,
                price: 1,
                quantity: 1,
                category: 1,
                createdAt: 1,
              },
            },
          ],
          count: [{ $count: "total" }],
        },
      },
    ]);

    res.send({
      count: result?.[0]?.count?.[0]?.total || 0,
      items: result?.[0]?.items || [],
    });
  } catch (err) {
    console.error("get all inventory error:", err);
    res.status(500).send({ message: "Failed to fetch inventory items" });
  }
};
// endregion

// region get inventory by id
const getInventoryById = async (req, res) => {
  try {
    const id = req?.params?.id;
    if (!mongoose.Types.ObjectId.isValid(id))
      return res.status(400).send({ message: "Invalid inventory ID" });

    const item = await Inventory?.findOne({ _id: id, isDeleted: 0 });
    if (!item) {
      return res.status(404).send({ message: "Inventory item not found" });
    }

    res.send({ item: item?.toObject() });
  } catch (err) {
    console.error("get inventory by id error:", err);
    res.status(500).send({ message: "Failed to fetch inventory item" });
  }
};
// endregion

// region update inventory
const updateInventory = async (req, res) => {
  try {
    const id = req?.params?.id;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).send({ message: "Invalid inventory ID" });
    }

    const updates = {};
    const fields = ["name", "price", "quantity", "category"];

    fields?.forEach((field) => {
      if (req?.body[field] !== undefined) {
        updates[field] =
          typeof req.body[field] === "string"
            ? req.body[field].trim()
            : req.body[field];
      }
    });

    if (!Object?.keys(updates).length) {
      return res.status(400).send({ message: "No valid fields to update" });
    }

    //  Fetch item
    const item = await Inventory?.findOne({ _id: id, isDeleted: 0 });

    if (!item) {
      return res.status(404).send({ message: "Inventory item not found" });
    }

    //  Ownership check
    if (!item.createdBy.equals(req?.user?._id) && req.user.role !== "admin") {
      return res
        .status(403)
        .send({ message: "Not allowed to update this item" });
    }

    //  Apply updates
    Object?.assign(item, updates);
    await item?.save();

    res.send({
      message: "Inventory item updated successfully",
      item: item.toObject(),
    });
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
    const id = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).send({ message: "Invalid inventory ID" });
    }

    //  Fetch item
    const item = await Inventory?.findOne({ _id: id, isDeleted: 0 });

    if (!item) {
      return res.status(404).send({ message: "Inventory item not found" });
    }

    //  Ownership check
    if (!item.createdBy.equals(req?.user?._id) && req.user.role !== "admin") {
      return res
        .status(403)
        .send({ message: "Not allowed to delete this item" });
    }

    //  Soft delete
    item.isDeleted = 1;
    await item?.save();

    res.send({
      message: "Inventory item deleted successfully",
      item: item?.toObject(),
    });
  } catch (err) {
    console.error("delete inventory error:", err);
    res.status(500).send({ message: "Failed to delete inventory item" });
  }
};
// endregion

// region exports
module.exports = {
  createInventory,
  getAllInventory,
  getInventoryById,
  updateInventory,
  deleteInventory,
};
// endregion
