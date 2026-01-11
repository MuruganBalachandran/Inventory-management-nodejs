// region imports
const express = require("express");
const auth = require("../middleware/auth");
const admin = require("../middleware/admin");
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
