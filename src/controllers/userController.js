// region imports
const User = require("../models/userModel");
const Inventory = require("../models/inventoryModel");
const STATUS_CODE = require("../constants/statusCodes");
const sendResponse = require("../utils/sendResponse");
// endregion

// region signup
const signup = async (req, res) => {
  try {
    const { name, email, password, age=0, role='user' } = req.body;

    const user = new User({ name: name.trim(), email: email.trim().toLowerCase(), password, age, role });
    await user.save();

    return sendResponse(res, STATUS_CODE.CREATED, "ok", "User registered successfully", user);
  } catch (err) {
    // Mongo duplicate key
    if (err.code === 11000) {
      return sendResponse(res, STATUS_CODE.BAD_REQUEST, "error", "Email already registered");
    }

    // Mongoose validation errors
    if (err.name === "ValidationError") {
      return sendResponse(res, STATUS_CODE.BAD_REQUEST, "error", Object.values(err.errors)[0].message);
    }
    return sendResponse(res, err?.statusCode || STATUS_CODE.INTERNAL_SERVER_ERROR, "error", err?.message || "Registration failed",null, "signup");
  }
};
// endregion

// region login
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findByCredentials(email.trim().toLowerCase(), password);
    const token = await user.generateAuthToken();

    return sendResponse(res, STATUS_CODE.OK, "ok", "Login successful", { user, token });
  } catch (err) {
    return sendResponse(res, STATUS_CODE.BAD_REQUEST, "error", err?.message || "Invalid email or password",null,"login");
  }
};
// endregion

// region logout
const logout = async (req, res) => {
  try {
    req.user.tokens = req.user.tokens.filter((t) => t.token !== req.token);
    await req.user.save();

    return sendResponse(res, STATUS_CODE.OK, "ok", "Logged out successfully");
  } catch (err) {
    return sendResponse(res, STATUS_CODE.INTERNAL_SERVER_ERROR, "error", err?.message || "Logout failed",null,"logout");
  }
};
// endregion

// region logout all
const logoutAll = async (req, res) => {
  try {
    req.user.tokens = [];
    await req.user.save();

    return sendResponse(res, STATUS_CODE.OK, "ok", "Logged out from all devices");
  } catch (err) {
    return sendResponse(res, STATUS_CODE.INTERNAL_SERVER_ERROR, "error", err?.message || "Logout failed",null,"logout all");
  }
};
// endregion

// region get profile
const getProfile = async (req, res) => {
  return sendResponse(res, STATUS_CODE.OK, "ok", "", { user: req.user });
};
// endregion

// region update profile
const updateProfile = async (req, res) => {
  try {
    const { name, password, age } = req.body;

       let isChanged = false;

    if (name !== undefined && name !== req.user.name) {
      req.user.name = name;
      isChanged = true;
    }

    if (password !== undefined) {
      req.user.password = password;
      isChanged = true;
    }

    if (age !== undefined && age !== req.user.age) {
      req.user.age = age;
      isChanged = true;
    }

    // No actual change
    if (!isChanged) {
      return sendResponse(
        res,
        STATUS_CODE.OK,
        "ok",
        "No changes detected",
        { user: req.user }
      );
    }
    await req.user.save();

    return sendResponse(res, STATUS_CODE.OK, "ok", "Profile updated successfully", { user: req.user });
  } catch (err) {
    if (err.name === "ValidationError") {
      const messages = Object.values(err.errors).map((e) => e.message);
      return sendResponse(res, STATUS_CODE.BAD_REQUEST, "error", messages.join(", "));
    }

    return sendResponse(res, STATUS_CODE.INTERNAL_SERVER_ERROR, "error", err?.message || "Update failed",null,"updateProfile");
  }
};
// endregion

// region delete account
const deleteAccount = async (req, res) => {
  try {
    const user = await User.findOneAndUpdate(
      { _id: req.user._id, isDeleted: 0 },
      { $set: { isDeleted: 1, tokens: [] } },
      { new: true }
    );

    // if (!user) {
    //   return sendResponse(res, STATUS_CODE.NOT_FOUND, "error", "User not found or already deleted");
    // }

    await Inventory.updateMany(
      { createdBy: user._id, isDeleted: 0 },
      { $set: { isDeleted: 1 } }
    );

    return sendResponse(
      res, STATUS_CODE.OK,
       "ok", 
       "Account deleted successfully", 
       { user });
  } catch (err) {
    return sendResponse(res, STATUS_CODE.INTERNAL_SERVER_ERROR, "error", err?.message || "Delete failed",null, "delete profile");
  }
};
// endregion

// module exports
module.exports = {
  signup,
  login,
  logout,
  logoutAll,
  getProfile,
  updateProfile,
  deleteAccount,
};
