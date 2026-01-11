// region imports
const path = require('path')
require('dotenv').config({ path: path.join(__dirname, '.env') });
require('./config/mongoose')
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

// region register middleware
app.use(express.json())
app.use(logger)
app.use('/api', router)
app.use(notFound)
app.use(errorHandler)
// endregion

// region exports
module.exports = app
// endregion
