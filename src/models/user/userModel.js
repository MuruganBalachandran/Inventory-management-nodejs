// region imports
const mongoose = require("mongoose");
const validator = require("validator");
const { hashPassword, verifyPassword } = require("../../utils/common/hashUtil");
// endregion


// region helper function
// manual date-time format: YYYY-MM-DD HH:mm:ss
const getFormattedDateTime = () => {
  const now = new Date();
  
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  const hours = String(now.getHours()).padStart(2, "0");
  const minutes = String(now.getMinutes()).padStart(2, "0");
  const seconds = String(now.getSeconds()).padStart(2, "0");

  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
};
// endregion


// region schema
const UserSchema = new mongoose.Schema(
  {
    Name: {
      type: String,
      required: true,
      trim: true,
      minlength: 3,
      maxlength: 20,
    },

    Email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      validate(value) {
        if (!validator.isEmail(value)) {
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
      enum: ["user", "admin"],
      default: "user",
    },

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
    timestamps: false,
  }
);
// endregion


// region minimal indexes
// Email unique only for ACTIVE users
UserSchema.index(
  { Email: 1 },
  { unique: true, partialFilterExpression: { Is_Deleted: 0 } }
);

// admin filtering
UserSchema.index({ Role: 1, Is_Deleted: 1 });

// endregion


// region middleware

// hash password before save
UserSchema.pre("save", async function (next) {
  try {
    if (this.isModified("Password")) {
      this.Password = await hashPassword(this.Password);
    }
    this.Updated_At = getFormattedDateTime();
  } catch (err) {
    next(err);
  }
});

// hash password on update
UserSchema.pre("findOneAndUpdate", async function (next) {
  try {
    const update = this.getUpdate();
    if (!update) return next();

    const pwd = update.Password || update.$set?.Password;

    if (pwd && !pwd.startsWith("$argon2")) {
      const hashed = await hashPassword(pwd);
      if (update.Password) update.Password = hashed;
      if (update.$set?.Password) update.$set.Password = hashed;
    }

    if (!update.$set) update.$set = {};
    update.$set.Updated_At = getFormattedDateTime();


  } catch (err) {
    next(err);
  }
});

// endregion


// region methods
UserSchema.methods.comparePassword = async function (password) {
  return verifyPassword(password, this.Password);
};
// endregion


// region transforms
const transform = (doc, ret) => {
  delete ret.Password;
  delete ret.Is_Deleted;
  return ret;
};

UserSchema.set("toJSON", { transform });
UserSchema.set("toObject", { transform });
// endregion


// region model
const User = mongoose.model("User", UserSchema);
// endregion


// region exports
module.exports = User;
// endregion
