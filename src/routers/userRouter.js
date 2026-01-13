// region imports
const express = require("express");
const auth = require("../middleware/auth");
const admin = require("../middleware/admin");
<<<<<<< HEAD
const {
  signupValidation,
  loginValidation,
  updateProfileValidation
} = require("../middleware/userValidation");
=======
>>>>>>> 444f163a5ca72f883d3a71eaa4076d959c28b34b
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
<<<<<<< HEAD
router.post("/signup",signupValidation, signup);
router.post("/login",loginValidation, login);
router.post("/logout", auth, logout);
router.post("/logout-all", auth, logoutAll);
router.get("/me", auth, getProfile);
router.patch("/me", auth,updateProfileValidation, updateProfile);
=======
router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", auth, logout);
router.post("/logout-all", auth, logoutAll);
router.get("/me", auth, getProfile);
router.patch("/me", auth, updateProfile);
>>>>>>> 444f163a5ca72f883d3a71eaa4076d959c28b34b
router.delete("/me", auth, deleteAccount);
// endregion

// region exports
module.exports = router;
// endregion
