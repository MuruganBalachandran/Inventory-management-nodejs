// region imports
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const STATUS_CODE = require("../constants/statusCodes");
const sendResponse = require("../utils/sendResponse");
// endregion

// region config
const jwtSecret = process.env.JWT_SECRET;
// endregion

// region middleware
const auth = async (req, res, next) => {
  try {
    const authHeader = req.header("Authorization");

    const token = authHeader?.startsWith("Bearer ")
      ? authHeader.replace("Bearer ", "")
      : null;

    if (!token) {
      return sendResponse(
        res,
        STATUS_CODE.UNAUTHORIZED,
        "error",
        "Please authenticate"
      );
    }

    const decoded = jwt.verify(token, jwtSecret);

    const user = await User.findOne({
      _id: decoded._id,
      isDeleted: 0,
      "tokens.token": token,
    });

    if (!user) {
      return sendResponse(
        res,
        STATUS_CODE.UNAUTHORIZED,
        "error",
        "Please authenticate",
                null,
        "auth middleware"
      );
    }

    req.user = user;
    req.token = token;
    next();
  } catch (err) {
      return sendResponse(
    res,
    err?.statusCode || STATUS_CODE.INTERNAL_SERVER_ERROR,
    "error",
    err?.message || "Something went wrong",
            null,
        "auth middleware"
  );
  }
};
// endregion

// region exports
module.exports = auth;
// endregion
