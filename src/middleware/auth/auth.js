// region package imports
const { verifyToken, sendResponse } = require("../../utils/common/commonFunctions");
const { env } = require("../../config/env/envConfig");
// endregion

// region model imports
const User = require('../../models/user/userModel');
// endregion



// region constants imports
const { STATUS_CODE, AUTH_MESSAGES, RESPONSE_STATUS } = require('../../utils/constants/constants');
// endregion

// region auth middleware (stateless JWT)
/**
 * Authentication middleware: Verifies JWT and attaches current User to req object.
 * Rejects requests if token is missing, expired, or user is deleted.
 */
const auth = async (req, res, next) => {
  try {
    // get Authorization header from request
    const authHeader = req.header?.('Authorization') ?? null;

    // extract token from 'Bearer <token>' string
    const token = authHeader?.startsWith?.('Bearer ') 
      ? authHeader.replace('Bearer ', '') 
      : null;

    // if no token is provided, reject request
    if (!token) {
      return sendResponse(
        res,
        STATUS_CODE?.UNAUTHORIZED ?? 401,
        RESPONSE_STATUS?.ERROR ?? 'error',
        AUTH_MESSAGES?.PLEASE_AUTHENTICATE ?? 'Please authenticate'
      );
    }

    // verify JWT token; throws if invalid or expired
    const decoded = verifyToken(token, env?.JWT_SECRET ?? "");

    // fetch active user from DB (Is_Deleted = false)
    const user = await User.findOne({ _id: decoded?._id, Is_Deleted: false });

    // reject if user does not exist or is soft-deleted
    if (!user) {
      return sendResponse(
        res,
        STATUS_CODE?.UNAUTHORIZED ?? 401,
        RESPONSE_STATUS?.ERROR ?? 'error',
        AUTH_MESSAGES?.PLEASE_AUTHENTICATE ?? 'Please authenticate'
      );
    }

    // attach the user object to request for downstream controllers
    req.user = user;

    // proceed to next middleware/route
    next();
  } catch (err) {
    // handle invalid token, expired token, or DB errors
    return sendResponse(
      res,
      STATUS_CODE?.UNAUTHORIZED ?? 401,
      RESPONSE_STATUS?.ERROR ?? 'error',
      err?.message ?? (AUTH_MESSAGES?.PLEASE_AUTHENTICATE ?? 'Please authenticate')
    );
  }
};
// endregion

// region exports
module.exports = auth;
// endregion
