// region imports
const express = require("express");
const auth = require("../middleware/auth");
const admin = require("../middleware/admin");
const {
  createInventoryValidation,
  updateInventoryValidation,
  idParamValidation,
  userIdParamValidation,
} = require("../middleware/inventoryValidation");

const {
  createInventory,
  getAllInventory,
  getMyInventory,
  getInventoryByUser,
  getInventoryById,
  updateInventory,
  deleteInventory,
  getInventoryStats,
  getMyInventoryStats,
  getInventoryByUserStats,
} = require("../controllers/inventoryController");
// endregion

const router = express.Router();

// region routes
router.post("/", auth, createInventoryValidation, createInventory);
router.get("/", auth, getAllInventory);
router.get("/stats", auth, admin, getInventoryStats);

router.get("/mine", auth, getMyInventory);
router.get("/mine/stats", auth, getMyInventoryStats);

router.get("/user/:userId", auth, admin, userIdParamValidation, getInventoryByUser);
router.get("/user/:userId/stats", auth, admin, userIdParamValidation, getInventoryByUserStats);

router.get("/:id", auth, idParamValidation, getInventoryById);
router.patch("/:id", auth, idParamValidation, updateInventoryValidation, updateInventory);
router.delete("/:id", auth, idParamValidation, deleteInventory);
// endregion

module.exports = router;
