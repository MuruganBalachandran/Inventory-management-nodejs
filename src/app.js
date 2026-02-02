// region imports
// package imports
const express = require('express');
const cors = require('cors'); 

//region config imports
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
const { superAdminRouter } = require('./routers/user/superAdminRouter');
// endregion

// region server initialization
/**
 * Initialize Express application instance.
 */
const app = express?.();
// endregion

// region register global middleware

// log all requests (moved to top for better observability)
app?.use?.(logger);

// parse JSON body
app?.use?.(express?.json?.());

// validate JSON format
app?.use?.(jsonValidator);

// apply CORS rules globally
app?.use?.(cors?.(corsOptions));
// endregion

// region API routes
app?.use?.('/api/health', healthRouter);
app?.use?.('/api/users', userRouter);
app?.use?.('/api/inventory', inventoryRouter);
app?.use?.('/api/super-admin', superAdminRouter);
// endregion

// region 404 handler
app?.use?.(notFound);
// endregion

// region error handler 
app?.use?.(errorHandler);
// endregion

// region exports
module.exports = app;
// endregion
