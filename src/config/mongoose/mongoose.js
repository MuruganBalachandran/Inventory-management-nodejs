// region imports
const mongoose = require("mongoose");
const chalk = require("chalk");
const { env } = require('../env/envConfig');
const { DATABASE_MESSAGES } = require('../../utils/constants/constants');
// endregion

// region connect to db
/**
 * Establishes a connection to the MongoDB database using Mongoose.
 * Exits the process if the connection cannot be established.
 */
const connectDB = async (options = {}) => {
  try {
    // connect using MongoDB URL from env config
    await mongoose?.connect?.(env?.MONGODB_URL ?? "", options ?? {});

    // log successful connection
    console.log(chalk?.green?.(DATABASE_MESSAGES?.CONNECTION_SUCCESS ?? 'Database connected successfully'));

  } catch (error) {
    // log failure reason for debugging
    console.error(chalk?.red?.(`${DATABASE_MESSAGES?.CONNECTION_FAILED ?? 'Database connection failed'}:`), error?.message ?? (DATABASE_MESSAGES?.CONNECTION_FAILED ?? 'Database connection failed'));

    // exit process because app cannot run without DB
    process?.exit?.(1);
  }
};
// endregion

// region connection events

// log when MongoDB connection drops (network issue, server down, etc.)
mongoose?.connection?.on?.('disconnected', () => {
  console.warn?.(chalk?.yellow?.(DATABASE_MESSAGES?.DISCONNECTED ?? 'Database disconnected'));
});

// log when MongoDB reconnects automatically
mongoose?.connection?.on?.('reconnected', () => {
  console.log?.(chalk?.cyan?.(DATABASE_MESSAGES?.RECONNECTED ?? 'Database reconnected'));
});

// log low-level Mongo errors
mongoose?.connection?.on?.('error', (err = {}) => {
  console.error?.(chalk?.red?.(`${DATABASE_MESSAGES?.RUNTIME_ERROR ?? 'Database runtime error'}:`), err?.message ?? 'Unknown database error');
});

// endregion

// region exports
module.exports = connectDB;
// endregion
