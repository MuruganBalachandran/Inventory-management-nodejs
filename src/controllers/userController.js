// region imports
const User = require("../models/userModel");
const Inventory = require("../models/inventoryModel");
const bcrypt = require("bcryptjs");
// endregion

// region signup
const signup = async (req, res) => {
  try {
    const name = req.body.name?.trim();
    const email = req.body.email?.trim().toLowerCase();
    const age = req.body.age ?? 0;
    const password = req.body.password;
    const role = req.body.role === "admin" ? "admin" : "user";

    if (!name || !email || !password) {
      return res.status(400).send({ message: "All fields are required" });
    }

    const user = new User({ name, email, password, role, age });
    await user.save();

    res.status(201).send({ message: "User registered successfully", user });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(409).send({ message: "Email already registered" });
    }
    console.error("signup error:", err);
    res.status(500).send({ message: "Registration failed" });
  }
};

// endregion

//region login
const login = async (req, res) => {
  try {
    const email = req.body.email?.trim().toLowerCase();
    const password = req.body.password;

    if (!email || !password) {
      return res.status(400).send({ message: "Email and password required" });
    }

    const user = await User.findByCredentials(email, password);
    const token = await user.generateAuthToken();

    res.send({ message: "Login successful", user, token });
  } catch (err) {
    console.error("login error:", err);
    res.status(400).send({ message: "Invalid email or password" });
  }
};
// endregion

// region logout
const logout = async (req, res) => {
  try {
    const tokens = req.user?.tokens?.filter((t) => t.token !== req.token) || [];
    if (req.user) {
      req.user.tokens = tokens;
    }

    await req.user?.save();

    res.send({ message: "Logged out successfully" });
  } catch (err) {
    console.error("logout error:", err);
    res.status(500).send({ message: "Logout failed" });
  }
};
// endregion

// region logout all
const logoutAll = async (req, res) => {
  try {
    if (req.user) {
      req.user.tokens = [];
    }
    await req.user?.save();

    res.send({ message: "Logged out from all devices" });
  } catch (err) {
    console.error("logout all error:", err);
    res.status(500).send({ message: "Logout failed" });
  }
};
// endregion

//region get profile
const getProfile = async (req, res) => {
  try {
    res.send({ user: req.user });
  } catch (err) {
    console.error("get profile error:", err);
    res.status(500).send({ message: "Failed to fetch profile" });
  }
};
// endregion

//region edit profile
const updateProfile = async (req, res) => {
  try {
    const allowedUpdates = ["name", "password", "age"];
    const updates = Object.keys(req.body);

    const isValid = updates.every((key) =>
      allowedUpdates.includes(key)
    );

    if (!isValid) {
      return res.status(400).send({ message: "Invalid updates" });
    }

    updates.forEach((key) => {
      req.user[key] = req.body[key];
    });

    await req.user.save();

    res.send({
      message: "Profile updated successfully",
      user: req.user,
    });
  } catch (err) {
    console.error("update error:", err);
    res.status(400).send({ message: "Update failed" });
  }
};
// endregion

//region delete account
const deleteAccount = async (req, res) => {
  try {
    const user = await User.findOneAndUpdate(
      { _id: req.user._id, isDeleted: 0 },
      { $set: { isDeleted: 1, tokens: [] } },
      { new: true }
    )
      .select({ _id: 1, name: 1, email: 1, age: 1, role: 1, createdAt: 1 })
      .lean();

    if (!user) {
      return res.status(404).send({
        message: "User not found or already deleted",
      });
    }
    // delete inventories creatred by user
    await Inventory.updateMany(
      { createdBy: user._id, isDeleted: 0 },
      { $set: { isDeleted: 1 } }
    );

    res.send({ message: "Account deleted successfully", user });
  } catch (err) {
    console.error("delete error:", err);
    res.status(500).send({ message: "Delete failed" });
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
// endregion