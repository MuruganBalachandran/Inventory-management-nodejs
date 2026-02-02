// region imports
// package imports
const express = require('express');

// middleware imports
const auth = require('../../middleware/auth/auth'); // verifies JWT and attaches req.user
const adminOnly = require('../../middleware/auth/adminOnly'); // allows admin and super_admin
// endregion

// region controller imports
const {
  createInventory,
  getAllInventory,
  getMyInventory,
  getInventoryByUser,
  getInventoryById,
  updateInventory,
  deleteInventory,
} = require('../../controllers/inventory/inventoryController');
// endregion

// region router initialization
const router = express.Router();
// endregion

// region global middleware
// apply authentication to all inventory routes
router.use(auth);
// endregion

// region routes
/**
 * Inventory management routes.
 * All routes require valid authentication.
 */

// create inventory item for logged-in user
router.post('/', createInventory);

// fetch all inventory (Anyone can read, as per policy)
router.get('/', getAllInventory);

// fetch inventory belonging to logged-in user
router.get('/mine', getMyInventory);

// admin can view inventory of specific user
router.get('/user/:id', adminOnly, getInventoryByUser);

// fetch inventory by ID (Anyone can read)
router.get('/:id', getInventoryById);

// update inventory item (owner or admin check inside controller)
router.patch('/:id', updateInventory);

// delete inventory item (soft delete — owner or admin only)
router.delete('/:id', deleteInventory);

// endregion

// region exports
module.exports = { inventoryRouter: router };
// endregion
