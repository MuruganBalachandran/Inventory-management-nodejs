// region utils imports
const sendResponse = require('../utils/sendResponse');
// endregion

// region constants imports
const STATUS_CODE = require('../constants/statusCodes');
const { INVENTORY_MESSAGES } = require('../constants/messages');
// endregion

// region admin middleware
const admin = (req, res, next) => {
  try {
    // check role
    if (req?.user?.role !== 'admin') {
      return sendResponse(
        res,
        STATUS_CODE.FORBIDDEN,
        'error',
        INVENTORY_MESSAGES.UNAUTHORIZED_ACCESS
      );
    }

    next();
  } catch (err) {
    return sendResponse(
      res,
      STATUS_CODE.INTERNAL_SERVER_ERROR,
      'error',
      err?.message || INVENTORY_MESSAGES.UNAUTHORIZED_ACCESS
    );
  }
};
// endregion

// region exports
module.exports = admin;
// endregion
