/**
 * Config Barrel + Environment Configuration
 */
const path = require('path');

require('dotenv').config({  path: path.join(__dirname, '../.env'), });

// region env extraction
const {
  PORT = 3000,
  MONGODB_URL,
  JWT_SECRET,
  CORS_ORIGIN,
} = process.env;
// endregion

// region env validation
if (!MONGODB_URL) {
  throw new Error('MONGODB_URL is not defined');
}

if (!JWT_SECRET) {
  throw new Error('JWT_SECRET is not defined');
}
// endregion

// region env object
const env = {
  PORT: Number(PORT),
  MONGODB_URL,
  JWT_SECRET,
  CORS_ORIGIN,
};
// endregion

// region config exports
const corsOptions = require('./cors');
// endregion

// region exports
module.exports = {
  env,
  corsOptions,
};
// endregion
