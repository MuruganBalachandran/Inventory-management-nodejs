// region imports
const express = require('express')
const userRoutes = require('./userRouter')
const inventoryRoutes = require('./inventoryRouter')
const healthRouter = require('./healthRouter')
// endregion

// region router
const router = express.Router()
// endregion

// region use router
router.use(healthRouter);
router.use('/users',userRoutes)
router.use('/inventory',inventoryRoutes)
// endregion

// region exports
module.exports = router
// endregion
