// region imports
const { sendResponse } = require('../../utils/common/commonFunctions');
const { STATUS_CODE, RESPONSE_STATUS, AUTH_MESSAGES } = require('../../utils/constants/constants');
// endregion

// region super admin only middleware
/**
 * Middleware to restrict access strictly to the Super Admin.
 * Assumes 'auth' middleware has already run and attached 'req.user'.
 */
const superAdminOnly = (req, res, next) => {
  try {
    if (req.user?.Role !== 'super_admin') {
      return sendResponse(
        res,
        STATUS_CODE?.FORBIDDEN ?? 403,
        RESPONSE_STATUS?.ERROR ?? 'error',
        AUTH_MESSAGES?.UNAUTHORIZED_ACCESS ?? 'Super Admin access required'
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
module.exports = superAdminOnly;
// endregion
