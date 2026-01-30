// region imports
// utils import for standardized API responses
const sendResponse = require('../../utils/common/sendResponse');

// constants import for status codes
const { STATUS_CODE } = require('../../utils/constants/constants');
// endregion

// region not found middleware
const notFound = (req, res, next) => {
  // immediately send 404 response for unmatched routes
  return sendResponse(
    res, // Express response object
    STATUS_CODE.NOT_FOUND, // HTTP 404
    'error', // status
    'Route not found' // descriptive message
  );
};
// endregion

// region exports
module.exports = notFound;
// endregion
