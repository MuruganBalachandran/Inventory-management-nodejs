// region imports
// package imports
const express = require('express');
//  middleware imports
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
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


// region global middleware
router.use(auth); // applies auth to ALL routes below
// endregion


// region routes
router.post('/', createInventory);

router.get('/', getAllInventory);

router.get('/mine', getMyInventory);

router.get(
  '/user/:userId',
  admin, // only extra middleware needed
  getInventoryByUser
);

router.get('/:id', getInventoryById);

router.patch('/:id', updateInventory);

router.delete('/:id', deleteInventory);
// endregion


// region exports
module.exports = router;
// endregion
