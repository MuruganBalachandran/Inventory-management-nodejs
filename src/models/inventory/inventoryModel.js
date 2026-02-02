// region imports
const mongoose = require("mongoose");
const { getFormattedDateTime } = require("../../utils/common/commonFunctions");
// endregion


// region inventory schema
const inventorySchema = new mongoose.Schema(
  {
    Name: {
      type: String,
      required: true,
      trim: true,
      minlength: 3,
      maxlength: 100,
    },

    Quantity: {
      type: Number,
      default: 0,
      min: [0, "Quantity must be positive"],
      validate(value) {
        if (!Number?.isInteger?.(value)) {
          throw new Error("Quantity must be an integer");
        }
      },
    },

    Price: {
      type: Number,
      required: true,
      min: [0, "Price must be positive"],
    },

    Category: {
      type: String,
      required: true,
      default: "others",
      trim: true,
    },

    // relation to user
    Created_By: {
      type: mongoose?.Schema?.Types?.ObjectId,
      ref: "User",
      required: true,
    },

    // soft delete
    Is_Deleted: {
      type: Boolean,
      default: false,
    },

    // manual timestamps
    Created_At: {
      type: String,
      default: () => getFormattedDateTime?.() ?? new Date()?.toISOString?.(),
    },

    Updated_At: {
      type: String,
      default: () => getFormattedDateTime?.() ?? new Date()?.toISOString?.(),
    },
  },
  {
    versionKey: false,
    timestamps: false, // DISABLED (manual control)
  }
);
// endregion


// region minimal indexes

// owner queries and sorting
inventorySchema?.index?.({ Created_By: 1, Is_Deleted: 1, Created_At: -1 });

// dashboard/category filtering
inventorySchema?.index?.({ Category: 1, Is_Deleted: 1 });

// sorting by date globally (admin/recent)
inventorySchema?.index?.({ Created_At: -1 });

// endregion


// region pre-save hook
/**
 * Pre-save hook to manually update the Updated_At timestamp.
 */
inventorySchema?.pre?.("save", function (next) {
  this.Updated_At = getFormattedDateTime?.() ?? new Date()?.toISOString?.();
});

/**
 * Pre-update hook to manually set the Updated_At timestamp on findOneAndUpdate.
 */
inventorySchema?.pre?.("findOneAndUpdate", function (next) {
  this?.set?.({ Updated_At: getFormattedDateTime?.() ?? new Date()?.toISOString?.() });
  next?.();
});
// endregion


// region transforms
inventorySchema?.set?.("toJSON", {
  transform(doc, ret) {
    if (ret) {
      delete ret.Is_Deleted;
    }
    return ret;
  },
});
inventorySchema?.set?.("toObject", {
  transform(doc, ret) {
    if (ret) {
      delete ret.Is_Deleted;
    }
    return ret;
  },
});
// endregion


// region model
const Inventory = mongoose?.model?.("Inventory", inventorySchema);
// endregion


// region exports
module.exports = Inventory;
// endregion
