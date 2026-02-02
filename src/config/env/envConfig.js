
// region imports
require('dotenv').config(); // Load variables from .env file into process.env
// endregion

// region extract values from config
const {
  DATABASE_MESSAGES,
  CONFIG_MESSAGES,
} = require('../../utils/constants/constants');

// region extract APP config safely
let appConfig = {};
try {
  // parse env vars from .env
  appConfig = JSON.parse(process?.env?.APP ?? '{}');
} catch (err) {
  throw new Error(CONFIG_MESSAGES?.INVALID_APP_CONFIG ?? 'Invalid APP environment variable JSON');
}

// region extract values from config
const {
  PORT = 3000,
  MONGODB_URL = "",
  JWT_SECRET = "",
  CORS_ORIGIN = [],
  SUPER_ADMIN_EMAIL = "",
  SUPER_ADMIN_PASSWORD = "",
} = appConfig ?? {};
// endregion

// region validate required env variables
// if no url
if (!MONGODB_URL) {
  throw new Error(CONFIG_MESSAGES?.DB_URL_MISSING ?? 'MONGODB_URL is not defined');
}

// if no jwt
if (!JWT_SECRET) {
  throw new Error(CONFIG_MESSAGES?.JWT_SECRET_MISSING ?? 'JWT_SECRET is not defined');
}
// endregion

// region construct clean env object
/**
 * Centralized environment configuration.
 * Extracts and validates variables from process.env.APP JSON.
 */
const env = {
  PORT: Number(PORT ?? 3000),
  MONGODB_URL: MONGODB_URL || "",
  JWT_SECRET: JWT_SECRET || "",
  CORS_ORIGIN: CORS_ORIGIN ?? [],
  SUPER_ADMIN_EMAIL: SUPER_ADMIN_EMAIL || "",
  SUPER_ADMIN_PASSWORD: SUPER_ADMIN_PASSWORD || "",
};
// endregion

// region exports
module.exports = { env };
// endregion

