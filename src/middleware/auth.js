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
const STATUS_CODE = require('../constants/statusCodes');
const { AUTH_MESSAGES } = require('../constants/messages');
// endregion

// region environment config
const jwtSecret = process.env.JWT_SECRET;
// endregion

// region auth middleware
const auth = async (req, res, next) => {
  try {
    const authHeader = req.header('Authorization');

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

    const decoded = jwt.verify(token, jwtSecret);

    const user = await User.findOne({
      _id: decoded._id,
      isDeleted: 0,
      'tokens.token': token,
    });

    if (!user) {
      return sendResponse(
        res,
        STATUS_CODE.UNAUTHORIZED,
        'error',
        AUTH_MESSAGES.PLEASE_AUTHENTICATE
      );
    }

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
