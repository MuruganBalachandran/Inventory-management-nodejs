// region package imports
const express = require('express');
// endregion

// region config imports
const corsOptions = require('./config/cors');
// endregion

// region middleware imports
const jsonValidator = require('./middleware/jsonValidator');
const logger = require('./middleware/logger');
const errorHandler = require('./middleware/errorHandler');
const notFound = require('./middleware/notFound');
// endregion

// region router imports
const router = require('./routers');
// endregion

// region server initialization
const app = express();
// endregion

// region register global middleware
// Parse JSON payloads
app.use(express.json(), jsonValidator);

// Enable CORS with configured options
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', corsOptions.origin);
    res.header(
        'Access-Control-Allow-Headers',
        corsOptions.allowedHeaders.join(', ')
    );
    res.header(
        'Access-Control-Allow-Methods',
        corsOptions.methods.join(', ')
    );
    if (req.method === 'OPTIONS') {
        return res.sendStatus(200);
    }
    next();
});

// Log all API requests
app.use(logger);

// API routes
app.use('/api', router);

// 404 Not Found handler
app.use(notFound);

// Global error handler (must be last)
app.use(errorHandler);
// endregion

// region exports
module.exports = app;
// endregion
