// region imports
// package imports
const express = require('express');
const cors = require('cors'); 

// config imports
const corsOptions = require('./config/cors/corsConfig');
// endregion

// region middleware imports
const jsonValidator = require('./middleware/jsonValidator/jsonValidator');
const logger = require('./middleware/logger/logger');
const errorHandler = require('./middleware/errorHandler/errorHandler');
const notFound = require('./middleware/notFound/notFound');
// endregion

// region router imports
const { healthRouter } = require('./routers/health/healthRouter');
const { userRouter } = require('./routers/user/userRouter');
const { inventoryRouter } = require('./routers/inventory/inventoryRouter');
// endregion

// region server initialization
const app = express();
// endregion

// region register global middleware

// parse JSON body
app.use(express.json());

// validate JSON format
app.use(jsonValidator);

// apply CORS rules globally
app.use(cors(corsOptions));

// log all requests
app.use(logger);

// endregion

// region API routes
app.use('/api/health', healthRouter);
app.use('/api/users', userRouter);
app.use('/api/inventory', inventoryRouter);
// endregion

// region 404 handler
app.use(notFound);
// endregion

// region error handler (must be last)
app.use(errorHandler);
// endregion

// region exports
module.exports = app;
// endregion
