// region package imports
const argon2 = require("argon2");
const jwt = require("jsonwebtoken");
const chalk = require('chalk');
// endregion

// region local imports
const { STATUS_CODE, RESPONSE_STATUS, VALIDATION_MESSAGES } = require('../constants/constants');
const { env } = require('../../config/env/envConfig');
// endregion

// region JWT configuration
const JWT_SECRET = env?.JWT_SECRET ?? "";
const JWT_EXPIRY = "7d";
// endregion


// region async handler wrapper
/**
 * Higher-order function that wraps async controller functions to catch errors.
 * Automatically passes any caught errors to the next middleware (Express error handler).
 */
const asyncHandler = (fn = () => {}, errorConfig = {}) => {
  return async (req, res, next) => {
    try {
      return await fn(req, res, next);
    } catch (err) {
       next(err);
    }
  };
};
// endregion


// region hash password utility
/**
 * Hashes a plaintext password using the Argon2id algorithm.
 * Argon2id is used for its superior protection against GPU-based and side-channel attacks.
 */
const hashPassword = async (password = "") => {
  // ensure password exists to avoid hashing empty string
  if (!password) return "";

  // use argon2id because it protects against GPU & side-channel attacks
  return argon2?.hash?.(password, {
    type: argon2?.argon2id,
    memoryCost: 2 ** 16, // 64 MB
    timeCost: 3,
    parallelism: 1,
  }) ?? "";
};
// endregion


// region verify password utility
/**
 * Compares a plaintext password attempt with a stored Argon2 hash.
 * @returns {Promise<Boolean>} True if the password matches.
 */
const verifyPassword = async (plainPassword = "", hashedPassword = "") => {
  // guard clauses prevent invalid verification attempts
  if (!plainPassword || !hashedPassword) {
    return false;
  }

  return argon2?.verify?.(hashedPassword, plainPassword) ?? false;
};
// endregion


// region generate token utility
/**
 * Signs a single-factor JWT token for a given User ID.
 * Uses HS256 algorithm and expires in 7 days.
 */
const generateToken = (userId = "") => {
  // prevent generating token without user id
  if (!userId) return "";

  return jwt?.sign?.(
    { _id: userId },
    JWT_SECRET,
    {
      expiresIn: JWT_EXPIRY,
      algorithm: "HS256", // explicitly define algorithm
    }
  ) ?? "";
};
// endregion


// region verify token utility
/**
 * Synchronously verifies and decodes a JWT token string.
 * @returns {Object|Null} Decoded payload or null if invalid.
 */
const verifyToken = (token = "") => {
  // ensure token exists
  if (!token) return null;

  return jwt?.verify?.(token, JWT_SECRET, {
    algorithms: ["HS256"],
  }) ?? null;
};
// endregion


// region send response utility
/**
 * Format and send a standardized JSON response from any controller.
 * Enforces consistency across all API endpoints.
 */
const sendResponse = (
  res,
  statusCode = STATUS_CODE?.OK ?? 200,
  status = RESPONSE_STATUS?.SUCCESS ?? 'ok',
  message = '',
  data = null
) => {
  // region Build response object
  const response = {
    statusCode,
    status,
    message,
  };

  // Include data if provided
  if (data !== null && data !== undefined) {
    response.data = data;
  }
  // endregion

  // region Log error responses for debugging
  if (status === (RESPONSE_STATUS?.ERROR ?? 'error')) {
    console?.error?.(
      chalk?.red?.(`[API ERROR - ${statusCode}]`),
      message || 'Unknown error'
    );
  }
  // endregion

  // region Send JSON response with HTTP status
  // res is framework-managed, no optional chaining
  return res.status(statusCode).json(response);
  // endregion
};
// endregion


// region date time formatter
/**
 * Returns the current timestamp in "YYYY-MM-DD HH:mm:ss" format.
 */
const getFormattedDateTime = () => {
  const now = new Date();
  
  const year = now.getFullYear() ?? 0;
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  const hours = String(now.getHours()).padStart(2, "0");
  const minutes = String(now.getMinutes()).padStart(2, "0");
  const seconds = String(now.getSeconds()).padStart(2, "0");
  
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
};
// endregion


// region ObjectId converter
/**
 * Wraps Mongoose ID casting to handle potential string input errors.
 */
const toObjectId = (id = '') => {
  const mongoose = require('mongoose');
  return id ? (new mongoose.Types.ObjectId(id)) : null;
};
// endregion


// region exports
module.exports = {
  asyncHandler,
  hashPassword,
  verifyPassword,
  generateToken,
  verifyToken,
  sendResponse,
  getFormattedDateTime,
  toObjectId,
};
// endregion
