// region imports
const express = require("express");
const auth = require("../middleware/auth");
const admin = require("../middleware/admin");
<<<<<<< HEAD
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
=======
const {createInventory,
    getAllInventory,
    getMyInventory,
    getInventoryByUser,
    getInventoryById,
    updateInventory,
    deleteInventory,
    getInventoryStats,
    getMyInventoryStats,
    getInventoryByUserStats
} = require("../controllers/inventoryController");
// endregion

// region router
const router = express.Router();
// endregion

// region routes
router.post("/", auth, createInventory);
router.get("/", auth, getAllInventory);
router.get("/stats", auth, getInventoryStats);
router.get("/mine", auth, getMyInventory);
router.get("/mine/stats", auth, getMyInventoryStats);
router.get("/user/:userId", auth, getInventoryByUser);
router.get("/user/:userId/stats", auth, getInventoryByUserStats);
router.get("/:id", auth, getInventoryById);
router.patch("/:id", auth, updateInventory);
router.delete("/:id", auth,admin, deleteInventory);
// endregion

// region exports
module.exports = router;
// endregion
>>>>>>> 444f163a5ca72f883d3a71eaa4076d959c28b34b
