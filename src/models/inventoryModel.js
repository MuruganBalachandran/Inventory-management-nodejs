// region imports
const mongoose = require("mongoose");
// endregion

// region inventory schema
const inventorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    quantity: {
      type: Number,
      default: 0,
      min: 0,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
      validate(value) {
        if (value < 1) {
          throw new Error("price must be positive");
        }
      },
    },
    category: {
      type: String,
      required: true,
      default: "others",
      trim: true,
    },
    createdBy:{
      type:mongoose.Schema.Types.ObjectId,
      ref:'User',
      required:true,
      index:true
    },
    isDeleted: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);
// endregion

// region indexes
inventorySchema.index({ isDeleted: 1, createdAt: -1 });
inventorySchema.index({ category: 1, isDeleted: 1 });
inventorySchema.index({ createdBy: 1, isDeleted: 1 });

// endregion

// region model
const Inventory = mongoose.model("Inventory", inventorySchema);
// endregion

// region exports
module.exports = Inventory;
// endregion
