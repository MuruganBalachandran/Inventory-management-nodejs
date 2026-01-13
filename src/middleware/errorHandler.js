// region imports
const STATUS_CODE = require("../constants/statusCodes");
const sendResponse = require("../utils/sendResponse");
// endregion
// region error handler
const errorHandler = (err, req, res, next) => {
  try {
    console.error(err);

    const statusCode =
      err?.statusCode || err?.status || STATUS_CODE.INTERNAL_SERVER_ERROR;

    const message = err?.message || "Internal Server Error";

    return sendResponse(res, statusCode, "error", message);
  } catch (err) {
    return sendResponse(
      res,
      err?.statusCode || STATUS_CODE.INTERNAL_SERVER_ERROR,
      "error",
      err?.message || "Something went wrong",
              null,
        "error Handler"
    );
  }
};
// endregion

// region exports
module.exports = errorHandler;
// endregion
