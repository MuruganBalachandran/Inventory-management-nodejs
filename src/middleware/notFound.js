// region utils imports
const sendResponse = require('../utils/sendResponse');
// endregion

// region constants imports
const STATUS_CODE = require('../constants/statusCodes');
// endregion

// region not found middleware
const notFound = (req, res, next) => {
  return sendResponse(
    res,
    STATUS_CODE.NOT_FOUND,
    'error',
    'Route not found'
  );
};
// endregion

// region exports
module.exports = notFound;
// endregion
