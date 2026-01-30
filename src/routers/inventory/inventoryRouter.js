// region imports
// package imports
const express = require('express');

// middleware imports
const auth = require('../../middleware/auth/auth'); // verifies JWT and attaches req.user
const admin = require('../../middleware/admin/admin'); // allows only admin users
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

// create inventory item for logged-in user
router.post('/', createInventory);

// fetch all inventory (admin-level visibility handled inside controller/service)
router.get('/', getAllInventory);

// fetch inventory belonging to logged-in user
router.get('/mine', getMyInventory);

// admin can view inventory of specific user
router.get('/user/:userId', admin, getInventoryByUser);

// fetch inventory by ID
router.get('/:id', getInventoryById);

// update inventory item (owner or admin check inside controller)
router.patch('/:id', updateInventory);

// delete inventory item (soft delete — owner or admin only)
router.delete('/:id', deleteInventory);

// endregion

// region exports
module.exports = { inventoryRouter: router };
// endregion
