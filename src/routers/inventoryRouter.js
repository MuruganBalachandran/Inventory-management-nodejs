// region imports
const express = require("express");
const auth = require("../middleware/auth");
const admin = require("../middleware/admin");
const {createInventory,
    getAllInventory,
    getInventoryById,
    updateInventory,
    deleteInventory
} = require("../controllers/inventoryController");
// endregion

// region router
const router = express.Router();
// endregion

// region routes
router.post("/", auth, createInventory);
router.get("/", auth, getAllInventory);
router.get("/:id", auth, getInventoryById);
router.patch("/:id", auth, updateInventory);
router.delete("/:id", auth, deleteInventory);
// endregion

// region exports
module.exports = router;
// endregion
