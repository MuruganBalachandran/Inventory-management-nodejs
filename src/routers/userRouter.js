// region imports
const express = require("express");
const auth = require("../middleware/auth");
const admin = require("../middleware/admin");
const {
  signupValidation,
  loginValidation,
  updateProfileValidation
} = require("../middleware/userValidation");
const {signup,
login,
logout,
logoutAll,
getProfile,
updateProfile,
deleteAccount
} = require("../controllers/userController");
// endregion

// region router
const router = express.Router();
// endregion

// region routes
router.post("/signup",signupValidation, signup);
router.post("/login",loginValidation, login);
router.post("/logout", auth, logout);
router.post("/logout-all", auth, logoutAll);
router.get("/me", auth, getProfile);
router.patch("/me", auth,updateProfileValidation, updateProfile);
router.delete("/me", auth, deleteAccount);
// endregion

// region exports
module.exports = router;
// endregion
