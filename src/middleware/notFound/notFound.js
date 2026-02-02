// region imports
// utils import for standardized API responses
const { sendResponse } = require('../../utils/common/commonFunctions');

// constants import for status codes
const { STATUS_CODE, RESPONSE_STATUS, SERVER_MESSAGES } = require('../../utils/constants/constants');
// endregion

// region not found middleware
/**
 * Fallback middleware for routes that don't match any registered handlers.
 * Sends a 404 Route Not Found response.
 */
const notFound = (req, res, next) => {
  // immediately send 404 response for unmatched routes
  return sendResponse(
    res, // Express response object
    STATUS_CODE?.NOT_FOUND ?? 404, // HTTP 404
    RESPONSE_STATUS?.ERROR ?? 'error', // status
    'Route not found' // descriptive message
  );
};
// endregion

// region exports
module.exports = notFound;
// endregion
