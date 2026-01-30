
// region imports
require('dotenv').config(); // Load variables from .env file into process.env
// endregion

// region extract APP config safely
let appConfig = {};
try {
  // parse env vars from .env
  appConfig = JSON.parse(process?.env?.APP || '{}');
} catch (err) {
  throw new Error('Invalid APP environment variable JSON');
}

// region extract values from config
const {
  PORT = 3000,     // Default server port if not provided
  MONGODB_URL="",     // MongoDB connection string (required)
  JWT_SECRET="",      // JWT secret key (required)
  CORS_ORIGIN=[],     // Frontend origin allowed by CORS
} = appConfig;
// endregion

// region validate required env variables
// if no url
if (!MONGODB_URL) {
  throw new Error('MONGODB_URL is not defined');
}

// if no jwt
if (!JWT_SECRET) {
  throw new Error('JWT_SECRET is not defined');
}
// endregion

// region construct clean env object
const env = {
  PORT: Number(PORT),
  MONGODB_URL,
  JWT_SECRET,
  CORS_ORIGIN,
};
// endregion

// region exports
module.exports = { env };
// endregion
