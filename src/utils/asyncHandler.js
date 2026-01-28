/**
 * Async Handler Wrapper
 * Wraps async controller functions to automatically catch and handle errors
 * Eliminates the need for try-catch blocks in every controller function
 */

const sendResponse = require('./sendResponse');
const { STATUS_CODE, VALIDATION_MESSAGES } = require('./constants');

// region async handler wrapper
/**
 * Wraps an async controller function to catch errors automatically
 * @param {Function} fn - The async controller function
 * @param {Object} errorConfig - Configuration for error handling
 * @returns {Function} Express middleware function
 */
const asyncHandler = (fn, errorConfig = {}) => {
    return async (req, res, next) => {
        try {
            return await fn(req, res, next);
        } catch (err) {
            console.error('[Controller Error]', err);

            // Handle duplicate key error (MongoDB)
            if (err?.code === 11000 && errorConfig.isDuplicateKeyError) {
                return sendResponse(
                    res,
                    STATUS_CODE.BAD_REQUEST,
                    'error',
                    errorConfig.duplicateKeyMessage || 'This field already exists'
                );
            }

            // Handle validation error
            if (err?.name === 'ValidationError' && errorConfig.isValidationContext) {
                const validationMessage =
                    Object.values(err.errors)?.[0]?.message || VALIDATION_MESSAGES.INVALID_INPUT;
                return sendResponse(
                    res,
                    STATUS_CODE.BAD_REQUEST,
                    'error',
                    validationMessage
                );
            }

            // Handle custom error messages (with specific status code)
            if (err?.statusCode) {
                return sendResponse(
                    res,
                    err.statusCode,
                    'error',
                    err.message || errorConfig.defaultMessage || 'An error occurred'
                );
            }

            // Handle custom error messages (default to unauthorized)
            if (err?.message && err?.isCustomError) {
                return sendResponse(
                    res,
                    STATUS_CODE.UNAUTHORIZED,
                    'error',
                    err.message
                );
            }

            // Generic error response
            return sendResponse(
                res,
                STATUS_CODE.INTERNAL_SERVER_ERROR,
                'error',
                errorConfig.defaultMessage || err?.message || 'An error occurred'
            );
        }
    };
};
// endregion

// region exports
module.exports = asyncHandler;
// endregion
