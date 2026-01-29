/**
 CORS Configuration
 Defines Cross-Origin Resource Sharing policies for the API
 */
// region imports
const { STATUS_CODE } = require('../utils/constants');
const envConfig = require('./environment.json');
// endregion

// region CORS Options
const corsOptions = {
    origin: envConfig.CORS_ORIGIN || 'http://localhost:5173',
    // Use configured origin or fallback to localhost
    credentials: true, // Allow cookies and credentials
    optionsSuccessStatus: STATUS_CODE.OK, // For legacy browser support
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'], // Allowed HTTP methods
    allowedHeaders: [
        'Content-Type', // Tells server what format the body is in.
        'Authorization', // for the Bearer token
        'X-Requested-With', // used to indicate request came from AJAX.
        'Accept',  // Tells server what response format the client expects.
    ], // Allowed headers
};
// endregion

// region exports
module.exports = corsOptions;
// endregion
