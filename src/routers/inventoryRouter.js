// region package imports
const express = require('express');
// endregion

// region middleware imports
const auth = require('../middleware/auth');
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
} = require('../controllers/inventoryController');
// endregion

// region router initialization
const router = express.Router();
// endregion

// region routes
router.post('/', auth, createInventory);

router.get('/', auth, getAllInventory);

router.get('/mine', auth, getMyInventory);

router.get(
  '/user/:userId',
  auth,
  getInventoryByUser
);

router.get('/:id', auth, getInventoryById);

router.patch(
  '/:id',
  auth,
  updateInventory
);

router.delete('/:id', auth, deleteInventory);
// endregion

// region exports
module.exports = router;
// endregion