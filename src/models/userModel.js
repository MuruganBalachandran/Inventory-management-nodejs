// region imports
const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
// endregion

// region config
const jwtSecret = process.env.JWT_SECRET;
// endregion

// region userSchema
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 3,
      maxlength: 20,
    },
    email: {
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
    password: {
      type: String,
      required: true,
      minlength: [8, "Password must be at least 8 characters"],
      trim: true,
      select: false,
      validate(value) {
        if (!/(?=.*[a-z])/.test(value)) {
          throw new Error(
            "Password must contain at least one lowercase letter"
          );
        }
        if (!/(?=.*[A-Z])/.test(value)) {
          throw new Error(
            "Password must contain at least one uppercase letter"
          );
        }
        if (!/(?=.*\d)/.test(value)) {
          throw new Error("Password must contain at least one number");
        }
        if (!/(?=.*[@$!%*?&])/.test(value)) {
          throw new Error(
            "Password must contain at least one special character (@$!%*?&)"
          );
        }
        if (value.toLowerCase().includes("password")) {
          throw new Error('Password cannot contain the word "password"');
        }
      },
    },
    age: {
      type: Number,
      default: 0,
      min: [0, "Age cannot be negative"],
      max: [120, "Age seems invalid"],
      validate(value) {
  if (!Number.isInteger(value)) {
    throw new Error("Age must be an integer");
  }
}
    },
    role: {
      type: String,
      default: "user",
    },
    isDeleted: {
      type: Number,
      default: 0,
    },
    tokens: [
      {
        token: {
          type: String,
          required: true,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);
// endregion

// region indexes
userSchema.index(
  { email: 1 }, 
  {unique: true , partialFilterExpression:{isDeleted:0}
});
// endregion

// region transforms - remove sensitive/private fields when converting documents
userSchema.set("toJSON", {
  transform(doc, ret) {
    delete ret.password;
    delete ret.tokens;
    delete ret.__v;
    delete ret.isDeleted;
    return ret;
  },
});

userSchema.set("toObject", {
  transform(doc, ret) {
    delete ret.password;
    delete ret.tokens;
    delete ret.__v;
    delete ret.isDeleted;
    return ret;
  },
});

userSchema.pre(  "save", async function (next) {
  try {
    const user = this;

    if (user?.isModified("password")) {
      // hashes password
      user.password = await bcrypt.hash(user.password, 10);
    }
  } catch (err) {
    next(err);
  }
});

userSchema.pre("findOneAndUpdate", async function (next) {
  try{
   const update = this.getUpdate();
  if (!update) return next();

  // Handle both direct and $set updates
  const password = update.password || update.$set?.password;
  if (!password) return next();

  // hash
  const hashed = await bcrypt.hash(password, 10);

  if (update.password) {
    update.password = hashed;
  } else if (update.$set?.password) {
    update.$set.password = hashed;
  }

  next();
  }catch(err){
    next(err)
  }

});

// region generate auth token
userSchema.methods.generateAuthToken = async function () {
  try {
    const user = this;

    const token = jwt.sign({ _id: user?._id?.toString() }, jwtSecret, {
      expiresIn: "1h",
    });

    user.tokens = user?.tokens?.concat({ token });
    await user?.save();
    return token;
  } catch (err) {
    console.error("generateAuthToken error:", err);
    throw err;
  }
};
// endregion

// region findByCredentials
userSchema.statics.findByCredentials = async (email, password) => {
  try {
    const user = await User.findOne({ email, isDeleted: 0 }).select("+password");;

    if (!user) {
      throw new Error("Invalid credentials");
    }

    const isMatch = await bcrypt.compare(password, user?.password);

    if (!isMatch) {
      throw new Error("Invalid credentials");
    }

    return user;
  } catch (err) {
    console.error("findByCredentials error:", err);
    throw err;
  }
};
// endregion

// region model
const User = mongoose.model("User", userSchema);
// endregion

// region exports
module.exports = User;
// endregion
