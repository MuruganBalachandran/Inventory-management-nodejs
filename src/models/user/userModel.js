// region imports
const mongoose = require("mongoose");
const validator = require("validator");
const { hashPassword, verifyPassword, getFormattedDateTime } = require("../../utils/common/commonFunctions");
// endregion


// region schema
const UserSchema = new mongoose.Schema(
  {
    Name: {
      type: String,
      required: true,
      trim: true,
      minlength: 3,
      maxlength: 50,
    },

    Email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      validate(value) {
        if (!validator?.isEmail?.(value)) {
          throw new Error("Invalid email");
        }
      },
    },

    Password: {
      type: String,
      required: true,
      select: false,
      minlength: 8,
    },

    Age: {
      type: Number,
      default: 0,
      min: 0,
      max: 120,
    },

    Role: {
      type: String,
      enum: ["super_admin", "admin", "user"],
      default: "user",
    },

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
    timestamps: false,
  }
);
// endregion


// region minimal indexes
// Email unique only for ACTIVE users
UserSchema?.index?.(
  { Email: 1 },
  { unique: true, partialFilterExpression: { Is_Deleted: false } }
);

// admin filtering and sorting
UserSchema?.index?.({ Role: 1, Is_Deleted: 1 });
UserSchema?.index?.({ Created_At: -1 }); // Optimize recent user sorting
UserSchema?.index?.({ Name: 1 });       // Optimize user searching

// endregion


// region middleware

/**
 * Pre-save hook to hash password and update the Updated_At timestamp.
 */
UserSchema?.pre?.("save", async function () {
  if (this?.isModified?.("Password")) {
    // Standardize: Only hash if it's not already hashed (prevents double-hashing)
    if (!this.Password?.startsWith?.("$argon2")) {
      this.Password = await hashPassword?.(this?.Password);
    }
  }
  this.Updated_At = getFormattedDateTime?.() ?? new Date()?.toISOString?.();
});

/**
 * Pre-update hook to hash password (if provided) and update the Updated_At timestamp.
 */
UserSchema?.pre?.("findOneAndUpdate", async function () {
  const update = this?.getUpdate?.();
  if (!update) return;

  const pwd = update?.Password || update?.$set?.Password;

  if (pwd && !pwd?.startsWith?.("$argon2")) {
    const hashed = await hashPassword?.(pwd);
    if (update?.Password) update.Password = hashed;
    if (update?.$set?.Password) update.$set.Password = hashed;
  }

  if (!update?.$set) update.$set = {};
  update.$set.Updated_At = getFormattedDateTime?.() ?? new Date()?.toISOString?.();
});

// endregion


// region methods
/**
 * Instance method to compare a plain password with the stored hash.
 */
UserSchema.methods.comparePassword = async function (password = "") {
  return verifyPassword?.(password, this?.Password) ?? false;
};
// endregion


// region transforms
const transform = (doc, ret) => {
  if (ret) {
    delete ret.Password;
    delete ret.Is_Deleted;
  }
  return ret;
};

UserSchema?.set?.("toJSON", { transform });
UserSchema?.set?.("toObject", { transform });
// endregion


// region model
const User = mongoose?.model?.("User", UserSchema);
// endregion


// region exports
module.exports = User;
// endregion
