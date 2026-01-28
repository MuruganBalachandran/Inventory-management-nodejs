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

// region auth middleware
const auth = async (req, res, next) => {
  try {
    // header fro authorization
    const authHeader = req.header('Authorization');

    // extract token
    const token = authHeader?.startsWith('Bearer ')
      ? authHeader.replace('Bearer ', '')
      : null;

    // if no token
    if (!token) {
      return sendResponse(
        res,
        STATUS_CODE.UNAUTHORIZED,
        'error',
        AUTH_MESSAGES.PLEASE_AUTHENTICATE
      );
    }

    // verify token
    const decoded = jwt.verify(token, jwtSecret);

    // find the user
    const user = await User.findOne({
      _id: decoded._id,
      isDeleted: 0,
      'tokens.token': token,
    });

    // if no user
    if (!user) {
      return sendResponse(
        res,
        STATUS_CODE.UNAUTHORIZED,
        'error',
        AUTH_MESSAGES.PLEASE_AUTHENTICATE
      );
    }
    // set token
    req.user = user;
    req.token = token;

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
