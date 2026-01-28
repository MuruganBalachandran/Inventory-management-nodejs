/**
 CORS Configuration
 Defines Cross-Origin Resource Sharing policies for the API
 */

const envConfig = require('./environment.json');

// region CORS Options
const corsOptions = {
    origin: envConfig.CORS_ORIGIN || 'http://localhost:5173',
    // Use configured origin or fallback to localhost
    credentials: true, // Allow cookies and credentials
    optionsSuccessStatus: 200, // For legacy browser support
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'], // Allowed HTTP methods
    allowedHeaders: [
        'Content-Type',
        'Authorization',
        'X-Requested-With',
        'Accept',
    ], // Allowed headers
};
// endregion

// region exports
module.exports = corsOptions;
// endregion
