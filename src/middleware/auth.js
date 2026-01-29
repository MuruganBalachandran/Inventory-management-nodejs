// region package imports
const jwt = require('jsonwebtoken');
// endregion

// region model imports
const User = require('../models/userModel');
// endregion

// region utils imports
const sendResponse = require('../utils/sendResponse');
// endregion

// region constants imports
const { STATUS_CODE, AUTH_MESSAGES } = require('../utils/constants');
// endregion

// region environment config
const { env } = require('../config');
const jwtSecret = env.JWT_SECRET;
// endregion

// region auth middleware (stateless JWT)
const auth = async (req, res, next) => {
  try {
    // get Authorization header
    const authHeader = req.header('Authorization');

    // extract token
    const token = authHeader?.startsWith('Bearer ')
      ? authHeader.replace('Bearer ', '')
      : null;

    if (!token) {
      return sendResponse(
        res,
        STATUS_CODE.UNAUTHORIZED,
        'error',
        AUTH_MESSAGES.PLEASE_AUTHENTICATE
      );
    }

    // verify JWT (throws if invalid)
    const decoded = jwt.verify(token, jwtSecret);

    // optional: fetch user to make sure they exist and not deleted
    const user = await User.findOne({ _id: decoded._id, isDeleted: 0 });
    if (!user) {
      return sendResponse(
        res,
        STATUS_CODE.UNAUTHORIZED,
        'error',
        AUTH_MESSAGES.PLEASE_AUTHENTICATE
      );
    }

    // attach user to request
    req.user = user;
    next();
  } catch (err) {
    return sendResponse(
      res,
      STATUS_CODE.UNAUTHORIZED,
      'error',
      err?.message || AUTH_MESSAGES.PLEASE_AUTHENTICATE
    );
  }
};
// endregion

// region exports
module.exports = auth;
// endregion
