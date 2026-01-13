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
      minlength: 3,
      maxlength: 50,
    },
    quantity: {
      type: Number,
      default: 0,
      min: [0,"Quantity must be positive"],
      validate(value) {
        if (!Number.isInteger(value)) {
          throw new Error("Quantity must be an integer");
        }
      },
    },
    price: {
      type: Number,
      required: true,
      min: [0,"Price must be positive"],
        validate(value) {
    if (!Number.isInteger(value)) {
      throw new Error("price must be an integer");
    }
  },
    },
    category: {
      type: String,
      required: true,
      default: "others",
      trim: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
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
// Index for listing all active items sorted by createdAt
inventorySchema.index({ isDeleted: 1, createdAt: -1 });
// Composite index for category-filtered lists (supports sort by createdAt)
inventorySchema.index({ isDeleted: 1, category: 1, createdAt: -1 });
// Compound index to optimize owner queries (createdBy + isDeleted + createdAt for sorting)
inventorySchema.index({ createdBy: 1, isDeleted: 1, createdAt: -1 });

// region transforms
inventorySchema.set("toJSON", {
  // doc -> This is the Mongoose Document itself
  // ret -> This is the plain JavaScript object that will be sent to the client
  transform(doc, ret) {
    delete ret.isDeleted;
    delete ret.__v;
    return ret;
  },
});

inventorySchema.set("toObject", {
  transform(doc, ret) {
    delete ret.isDeleted;
    delete ret.__v;
    return ret;
  },
});
// endregion

// region model
const Inventory = mongoose.model("Inventory", inventorySchema);
// endregion

// region exports
module.exports = Inventory;
// endregion
