/**
 CORS Configuration
 Defines Cross-Origin Resource Sharing policies for the API
 */

// region CORS Options
const corsOptions = {
    origin: process.env.CORS_ORIGIN || '*', // Allow all origins if not specified
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
