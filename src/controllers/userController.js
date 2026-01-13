// region imports
const User = require("../models/userModel");
const Inventory = require("../models/inventoryModel");
<<<<<<< HEAD
const STATUS_CODE = require("../constants/statusCodes");
const sendResponse = require("../utils/sendResponse");
=======
const bcrypt = require("bcryptjs");
>>>>>>> 444f163a5ca72f883d3a71eaa4076d959c28b34b
// endregion

// region signup
const signup = async (req, res) => {
  try {
<<<<<<< HEAD
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
=======
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
>>>>>>> 444f163a5ca72f883d3a71eaa4076d959c28b34b
  }
};
// endregion

// region logout
const logout = async (req, res) => {
  try {
<<<<<<< HEAD
    req.user.tokens = req.user.tokens.filter((t) => t.token !== req.token);
    await req.user.save();

    return sendResponse(res, STATUS_CODE.OK, "ok", "Logged out successfully");
  } catch (err) {
    return sendResponse(res, STATUS_CODE.INTERNAL_SERVER_ERROR, "error", err?.message || "Logout failed",null,"logout");
=======
    const tokens = req.user?.tokens?.filter((t) => t.token !== req.token) || [];
    if (req.user) {
      req.user.tokens = tokens;
    }

    await req.user?.save();

    res.send({ message: "Logged out successfully" });
  } catch (err) {
    console.error("logout error:", err);
    res.status(500).send({ message: "Logout failed" });
>>>>>>> 444f163a5ca72f883d3a71eaa4076d959c28b34b
  }
};
// endregion

// region logout all
const logoutAll = async (req, res) => {
  try {
<<<<<<< HEAD
    req.user.tokens = [];
    await req.user.save();

    return sendResponse(res, STATUS_CODE.OK, "ok", "Logged out from all devices");
  } catch (err) {
    return sendResponse(res, STATUS_CODE.INTERNAL_SERVER_ERROR, "error", err?.message || "Logout failed",null,"logout all");
=======
    if (req.user) {
      req.user.tokens = [];
    }
    await req.user?.save();

    res.send({ message: "Logged out from all devices" });
  } catch (err) {
    console.error("logout all error:", err);
    res.status(500).send({ message: "Logout failed" });
>>>>>>> 444f163a5ca72f883d3a71eaa4076d959c28b34b
  }
};
// endregion

<<<<<<< HEAD
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
=======
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
>>>>>>> 444f163a5ca72f883d3a71eaa4076d959c28b34b
  }
};
// endregion

<<<<<<< HEAD
// region delete account
=======
//region delete account
>>>>>>> 444f163a5ca72f883d3a71eaa4076d959c28b34b
const deleteAccount = async (req, res) => {
  try {
    const user = await User.findOneAndUpdate(
      { _id: req.user._id, isDeleted: 0 },
      { $set: { isDeleted: 1, tokens: [] } },
      { new: true }
<<<<<<< HEAD
    );

    // if (!user) {
    //   return sendResponse(res, STATUS_CODE.NOT_FOUND, "error", "User not found or already deleted");
    // }

=======
    )
      .select({ _id: 1, name: 1, email: 1, age: 1, role: 1, createdAt: 1 })
      .lean();

    if (!user) {
      return res.status(404).send({
        message: "User not found or already deleted",
      });
    }
    // delete inventories creatred by user
>>>>>>> 444f163a5ca72f883d3a71eaa4076d959c28b34b
    await Inventory.updateMany(
      { createdBy: user._id, isDeleted: 0 },
      { $set: { isDeleted: 1 } }
    );

<<<<<<< HEAD
    return sendResponse(
      res, STATUS_CODE.OK,
       "ok", 
       "Account deleted successfully", 
       { user });
  } catch (err) {
    return sendResponse(res, STATUS_CODE.INTERNAL_SERVER_ERROR, "error", err?.message || "Delete failed",null, "delete profile");
=======
    res.send({ message: "Account deleted successfully", user });
  } catch (err) {
    console.error("delete error:", err);
    res.status(500).send({ message: "Delete failed" });
>>>>>>> 444f163a5ca72f883d3a71eaa4076d959c28b34b
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
<<<<<<< HEAD
=======
// endregion
>>>>>>> 444f163a5ca72f883d3a71eaa4076d959c28b34b
