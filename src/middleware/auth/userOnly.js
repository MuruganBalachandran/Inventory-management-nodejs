// region imports
const { sendResponse } = require('../../utils/common/commonFunctions');
const { STATUS_CODE, RESPONSE_STATUS, AUTH_MESSAGES } = require('../../utils/constants/constants');
// endregion

// region user only middleware
/**
 * Middleware to restrict access strictly to standard Users.
 * Assumes 'auth' middleware has already run and attached 'req.user'.
 */
const userOnly = (req, res, next) => {
  try {
    if (req.user?.Role !== 'user') {
      return sendResponse(
        res,
        STATUS_CODE?.FORBIDDEN ?? 403,
        RESPONSE_STATUS?.ERROR ?? 'error',
        'User access required'
      );
    }
    next();
  } catch (err) {
    return sendResponse(
      res,
      STATUS_CODE?.INTERNAL_SERVER_ERROR ?? 500,
      RESPONSE_STATUS?.ERROR ?? 'error',
      err?.message || 'Authorization error'
    );
  }
};
// endregion

// region exports
module.exports = userOnly;
// endregion
