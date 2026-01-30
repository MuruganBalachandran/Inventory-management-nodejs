// region utils imports
const sendResponse = require('../../utils/common/sendResponse');
// endregion

// region constants imports
const { STATUS_CODE, INVENTORY_MESSAGES } = require('../../utils/constants/constants');
// endregion



// region admin middleware
const admin = (req, res, next) => {
  try {
    // check user role (case-sensitive match)
    if (req?.user?.Role !== 'admin') {
      return sendResponse(
        res,
        STATUS_CODE.FORBIDDEN,
        'error',
        INVENTORY_MESSAGES.UNAUTHORIZED_ACCESS
      );
    }

    // user is admin; proceed to next middleware or route
    next();
  } catch (err) {
    // handle unexpected errors gracefully
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
