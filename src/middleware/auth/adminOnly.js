// region imports
const { sendResponse } = require('../../utils/common/commonFunctions');
const { STATUS_CODE, RESPONSE_STATUS, AUTH_MESSAGES } = require('../../utils/constants/constants');
// endregion

// region admin only middleware
/**
 * Middleware to restrict access to Admin and Super Admin roles.
 * Assumes 'auth' middleware has already run and attached 'req.user'.
 */
const adminOnly = (req, res, next) => {
  try {
    const role = req.user?.Role;
    if (role !== 'admin' && role !== 'super_admin') {
      return sendResponse(
        res,
        STATUS_CODE?.FORBIDDEN ?? 403,
        RESPONSE_STATUS?.ERROR ?? 'error',
        AUTH_MESSAGES?.UNAUTHORIZED_ACCESS ?? 'Admin access required'
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
module.exports = adminOnly;
// endregion
