// region imports
const mongoose = require("mongoose");
// endregion


// region helper function
// generate timestamp in: YYYY-MM-DD HH:mm:ss format (manual control)
const getFormattedDateTime = () => {
  const now = new Date();
  return now.toISOString().replace("T", " ").split(".")[0];
};
// endregion


// region inventory schema
const inventorySchema = new mongoose.Schema(
  {
    Name: {
      type: String,
      required: true,
      trim: true,
      minlength: 3,
      maxlength: 50,
    },

    Quantity: {
      type: Number,
      default: 0,
      min: [0, "Quantity must be positive"],
      validate(value) {
        if (!Number.isInteger(value)) {
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
      type: mongoose.Schema.Types.ObjectId,
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
      default: getFormattedDateTime,
    },

    Updated_At: {
      type: String,
      default: getFormattedDateTime,
    },
  },
  {
    versionKey: false,
    timestamps: false, // DISABLED (manual control)
  }
);
// endregion


// region minimal indexes

// owner queries (most common)
inventorySchema.index({ Created_By: 1, Is_Deleted: 1 });

// endregion


// region pre-save hook
// update Updated_At on every save
inventorySchema.pre("save", function (next) {
  this.Updated_At = getFormattedDateTime();
});
// endregion


// region transforms
inventorySchema.set("toJSON", {
  transform(doc, ret) {
    delete ret.Is_Deleted;
    return ret;
  },
});
inventorySchema.set("toObject", {
  transform(doc, ret) {
    delete ret.Is_Deleted;
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
