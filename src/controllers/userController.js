// region imports
const User = require("../models/userModel");
const bcrypt = require("bcryptjs");
// endregion

// region signup
const signup = async (req, res) => {
  try {
    const name = req?.body?.name?.trim();
    const email = req?.body?.email?.trim()?.toLowerCase();
    const password = req?.body?.password;
    const role = req?.body?.role === "admin" ? "admin" : "user";

    if (!name || !email || !password) {
      return res.status(400).send({ message: "All fields are required" });
    }

    const user = new User({ name, email, password, role });
    await user?.save();

    // Alternate  way
    // const existingUser = await User.findOne({ email, isDeleted: 0 });
    // if (existingUser) return res.status(409).send({ message: "Email already registered" });

    res.status(201).send({ message: "User registered successfully", user });
  } catch (err) {
    if (err?.code === 11000) {
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
    const email = req?.body?.email?.trim()?.toLowerCase();
    const password = req?.body?.password;
    if (!email || !password) {
      return res.status(400).send({ message: "Email and password required" });
    }
    const user = await User?.findByCredentials(email, password);
    const token = await user?.generateAuthToken();

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
    req.user.tokens = req?.user?.tokens?.filter((t) => t.token !== req?.token);

    await req?.user?.save();

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
    req.user.tokens = [];
    await req?.user?.save();

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
    const [user] = await User?.aggregate([
      { $match: { _id: req?.user?._id, isDeleted: 0 } },
      { $project: { _id: 1, name: 1, email: 1, age: 1, role: 1 } },
    ]);

    // Alternate  way
    // res.send({ user: { name: req?.user?.name, email: req?.user?.email, age: req?.user?.age, role: req?.user?.role } });

    res.send({ user });
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
    const updates = Object?.keys(req?.body || {});
    const isValid = updates?.every((key) => allowedUpdates?.includes(key));
    if (!isValid) {
      return res.status(400).send({ message: "Invalid updates" });
    }

    const updateData = { ...req?.body };

    if (updateData?.password) {
      updateData.password = await bcrypt.hash(updateData?.password, 8);
    }

    const updatedUser = await User.findOneAndUpdate(
      { _id: req.user?._id, isDeleted: 0 },
      { $set: updateData },
      { new: true, runValidators: true }
    );

    res.send({ message: "Profile updated successfully", user: updatedUser });

    // updates.forEach((key) => { req.user[key] = req?.body?.[key]; });
    // await req?.user?.save();
  } catch (err) {
    console.error("update error:", err);
    res.status(400).send({ message: "Update failed" });
  }
};
// endregion

//region delete account
const deleteAccount = async (req, res) => {
  try {
    const user = await User?.findOneAndUpdate(
      { _id: req.user?._id, isDeleted: 0 },
      { $set: { isDeleted: 1 } },
      { new: true }
    );

    // Alternate  way
    // req.user.isDeleted = 1;
    // await req.user.save();

    if (!user) {
      return res
        .status(404)
        .send({ message: "User not found or already deleted" });
    }
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
