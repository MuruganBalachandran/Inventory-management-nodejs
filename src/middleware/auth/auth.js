// region package imports
const { verifyToken } = require("../../utils/common/jwtUtil");
const { JWT_SECRET } = require("../../config/env/envConfig");
// endregion

// region model imports
const User = require('../../models/user/userModel');
// endregion

// region utils imports
const sendResponse = require('../../utils/common/sendResponse');
// endregion

// region constants imports
const { STATUS_CODE, AUTH_MESSAGES } = require('../../utils/constants/constants');
// endregion

// region auth middleware (stateless JWT)
const auth = async (req, res, next) => {
  try {
    // get Authorization header from request
    const authHeader = req.header?.('Authorization') ?? null;

    // extract token from 'Bearer <token>' string
    const token = authHeader?.startsWith('Bearer ') 
      ? authHeader.replace('Bearer ', '') 
      : null;

    // if no token is provided, reject request
    if (!token) {
      return sendResponse(
        res,
        STATUS_CODE.UNAUTHORIZED,
        'error',
        AUTH_MESSAGES.PLEASE_AUTHENTICATE
      );
    }

    // verify JWT token; throws if invalid or expired
    const decoded = verifyToken(token, JWT_SECRET);

    // fetch active user from DB (Is_Deleted = 0)
    const user = await User.findOne({ _id: decoded?._id, Is_Deleted: 0 });

    // reject if user does not exist or is soft-deleted
    if (!user) {
      return sendResponse(
        res,
        STATUS_CODE.UNAUTHORIZED,
        'error',
        AUTH_MESSAGES.PLEASE_AUTHENTICATE
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
      STATUS_CODE.UNAUTHORIZED,
      'error',
      err?.message ?? AUTH_MESSAGES.PLEASE_AUTHENTICATE
    );
  }
};
// endregion

// region exports
module.exports = auth;
// endregion
