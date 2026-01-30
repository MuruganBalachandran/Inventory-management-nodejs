/**
 * Async Handler Wrapper
 * --------------------
 * Wraps async controller functions to automatically catch and handle errors.
 * Eliminates the need for repetitive try-catch blocks in every controller function.
 */

const sendResponse = require('./sendResponse');
const { STATUS_CODE, VALIDATION_MESSAGES } = require('../constants/constants');
const { env } = require('../../config/env/envConfig');
// region async handler wrapper
/*
  Purpose:
  - Wraps async controller functions.
  - Automatically handles errors:
    - MongoDB duplicate key errors
    - Mongoose validation errors
    - Custom errors with status codes
    - Generic/internal server errors
  Parameters:
  - fn: async controller function (req, res, next)
  - errorConfig: optional configuration object
    - isDuplicateKeyError: boolean to enable duplicate key handling
    - duplicateKeyMessage: message for duplicate key errors
    - isValidationContext: boolean to enable mongoose validation error handling
    - defaultMessage: fallback message for generic errors
*/
const asyncHandler = (fn, errorConfig = {}) => {
  return async (req, res, next) => {
    try {
      return await fn(req, res, next);
    } catch (err) {
       next(err);
    }
  };
};

// region exports
module.exports = asyncHandler;
// endregion
