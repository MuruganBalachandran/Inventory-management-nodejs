// region package imports
const express = require('express');
// endregion

// region router imports
const healthRouter = require('./healthRouter');
const userRoutes = require('./userRouter');
const inventoryRoutes = require('./inventoryRouter');
// endregion

// region router initialization
const router = express.Router();
// endregion

// region register routes
// Health check endpoint
router.use('/', healthRouter);

// User authentication and profile endpoints
router.use('/users', userRoutes);

// Inventory management endpoints
router.use('/inventory', inventoryRoutes);
// endregion

// region exports
module.exports = router;
// endregion
