// region imports
const STATUS_CODE = require("../constants/statusCodes");
const sendResponse = require("../utils/sendResponse");
// endregion

// region middleware
const admin = (req, res, next) => {
  try {
    if (req?.user?.role !== "admin") {
      return sendResponse(
        res,
        STATUS_CODE.FORBIDDEN,
        "error",
        "Admin access required",
        null,
        "Admin middleware"
      );
    }
    next();
  } catch (err) {
    return sendResponse(
      res,
      err?.statusCode || STATUS_CODE.INTERNAL_SERVER_ERROR,
      "error",
      err?.message || "Something went wrong",
              null,
        "Admin middleware"
    );
  }
};
// endregion

// region exports
module.exports = admin;
// endregion
