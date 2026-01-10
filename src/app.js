// region imports
// const path = require('path')
// require('dotenv').config();
require('./db/mongoose')
const express = require('express')
// const userRouter = require('./routers/userRouter')
// const inventoryRouter = require("./routers/inventoryRouter")
const router = require('./routers/index')
const notFound = require('./middleware/notFound')
const errorHandler = require('./middleware/errorHandler')
const logger = require('./middleware/logger');
// endregion

// region server
const app = express()
// endregion

// region express middleware
app.use(express.json())
app.use('/api', router)
// endregion

// region logger middleware
app.use(logger)
// endregion

// region 404 not found handler
app.use(notFound)
// endregion

// region centralized error handler
app.use(errorHandler)
// endregion

// region exports
module.exports = app
// endregion
