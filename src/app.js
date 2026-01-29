// region  imports
// package imports
const express = require('express');
//  config imports
const corsOptions = require('./config/cors');
// endregion

// region middleware imports
const jsonValidator = require('./middleware/jsonValidator');
const logger = require('./middleware/logger');
const errorHandler = require('./middleware/errorHandler');
const notFound = require('./middleware/notFound');
const { apiLimiter } = require('./middleware/rateLimiter');
// endregion

// region router imports
const router = require('./routers');
const { STATUS_CODE } = require('./utils/constants');
// endregion

// region server initialization
const app = express();
// endregion

// region register global middleware
// Parse JSON payloads
app.use(express.json(), jsonValidator);
// express.json() -> tries to parse body as JSON
// (if parsing fails) -> jsonValidator : catches the parsing error

// Enable CORS with configured options
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', corsOptions.origin); // support origins/domains
    res.header(
        'Access-Control-Allow-Headers', // allowedHeaders
        corsOptions.allowedHeaders.join(', ')
    );
    res.header(
        'Access-Control-Allow-Methods', // allowed methods
        corsOptions.methods.join(', ')
    );
    if (req.method === 'OPTIONS') {
        return res.sendStatus(STATUS_CODE.OK);
    }
    next();
});

// Log all API requests
app.use(logger);

// rate limiting
app.use('/api', apiLimiter);
// API routes - Route exists -> controller runs -> response sent
app.use('/api', router);

// 404 Not Found handler -  
// if no rout found / Route path matches, but method doesn’t
app.use(notFound);

// Global error handler  - Runs only when error happens
app.use(errorHandler);
// endregion

// region exports
module.exports = app;
// endregion
