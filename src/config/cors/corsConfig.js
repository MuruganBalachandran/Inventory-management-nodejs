
// region imports
const { STATUS_CODE, CONFIG_MESSAGES } = require('../../utils/constants/constants');
const { env } = require("../env/envConfig"); // import validated env object
// endregion

// region prepare allowed origins

// normalize CORS_ORIGIN because it may be string or array in env
const allowedOrigins = Array.isArray(env?.CORS_ORIGIN)
  ? env?.CORS_ORIGIN
  : [env?.CORS_ORIGIN ?? ''].filter(Boolean);

// endregion

// region CORS Options
/**
 * Configuration object for Express CORS middleware.
 * Implements origin whitelisting, credentials support, and method restriction.
 */
const corsOptions = {
  // use function because multiple frontend origins may exist (dev, prod, staging)
  origin: (origin = '', callback = () => {}) => {
    // allow tools like Postman or mobile apps that send no origin
    if (!origin) return callback?.(null, true);

    // allow request if origin matches allowed list
    if (allowedOrigins?.includes?.(origin)) {
      return callback?.(null, true);
    }

    // block request if origin is not whitelisted
    return callback?.(new Error(CONFIG_MESSAGES?.CORS_NOT_ALLOWED ?? 'Not allowed by CORS'));
  },

  // allow cookies and authorization headers in requests
  credentials: true,

  // support legacy browsers that fail on 204
  optionsSuccessStatus: STATUS_CODE?.OK ?? 200,

  // define which HTTP methods backend accepts
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],

  // define headers client is allowed to send
  allowedHeaders: [
    'Content-Type',
    'Authorization',
    'X-Requested-With',
    'Accept',
  ],
};
// endregion

// region exports
module.exports = corsOptions;
// endregion
