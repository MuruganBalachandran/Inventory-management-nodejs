<<<<<<< HEAD
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
=======
// region error handler
const errorHandler = (err, req, res, next) => {
  console.error(err);

  const status = err?.statusCode || err?.status || 500;
  const message = err?.message || "Internal Server Error";

  res?.status(status).send({ message });
>>>>>>> 444f163a5ca72f883d3a71eaa4076d959c28b34b
};
// endregion

// region exports
module.exports = errorHandler;
// endregion
