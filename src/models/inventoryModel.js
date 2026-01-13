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
<<<<<<< HEAD
      minlength: 3,
      maxlength: 50,
=======
>>>>>>> 444f163a5ca72f883d3a71eaa4076d959c28b34b
    },
    quantity: {
      type: Number,
      default: 0,
<<<<<<< HEAD
      min: [0,"Quantity must be positive"],
      validate(value) {
        if (!Number.isInteger(value)) {
          throw new Error("Quantity must be an integer");
        }
      },
=======
      min: 0,
>>>>>>> 444f163a5ca72f883d3a71eaa4076d959c28b34b
    },
    price: {
      type: Number,
      required: true,
<<<<<<< HEAD
      min: [0,"Price must be positive"],
        validate(value) {
    if (!Number.isInteger(value)) {
      throw new Error("price must be an integer");
    }
  },
=======
      min: 0,
      validate(value) {
        if (value < 1) {
          throw new Error("price must be positive");
        }
      },
>>>>>>> 444f163a5ca72f883d3a71eaa4076d959c28b34b
    },
    category: {
      type: String,
      required: true,
      default: "others",
      trim: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
<<<<<<< HEAD
      ref: "User",
      required: true,
=======
      ref: 'User',
      required: true
>>>>>>> 444f163a5ca72f883d3a71eaa4076d959c28b34b
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
<<<<<<< HEAD

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
=======
// text index on name for efficient text search using $text
inventorySchema.index({ name: "text" });
>>>>>>> 444f163a5ca72f883d3a71eaa4076d959c28b34b
// endregion

// region model
const Inventory = mongoose.model("Inventory", inventorySchema);
// endregion

// region exports
module.exports = Inventory;
// endregion
