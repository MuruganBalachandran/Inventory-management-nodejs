// region imports
// package imports
const chalk = require('chalk');
// endregion

// region utils imports
const { sendResponse } = require('../../utils/common/commonFunctions');
// endregion

// region constants imports
const {
  STATUS_CODE,
  SERVER_MESSAGES,
  RESPONSE_STATUS,
} = require('../../utils/constants/constants');
// endregion

// region error handler middleware
/**
 * Global error handling middleware for Express.
 * Catches all errors passed via next(err) and sends a standardized JSON response.
 */
const errorHandler = (err, req, res, next) => {
  try {
    // log the error message in red
    console?.error?.(chalk?.red?.('[ERROR]'), err?.message ?? 'Unknown error');
    console?.log?.('from global error handler');

    // determine status code; default to 500
    const statusCode =
      err?.statusCode ?? err?.status ?? (STATUS_CODE?.INTERNAL_SERVER_ERROR ?? 500);

    // determine error message; default to generic server message
    const message = err?.message ?? (SERVER_MESSAGES?.INTERNAL_SERVER_ERROR ?? 'Internal server error');

    // send standardized error response
    return sendResponse(res, statusCode, RESPONSE_STATUS?.ERROR ?? 'error', message);
  } catch (handlerErr) {
    // fallback if error occurs inside the error handler itself
    return sendResponse(
      res,
      STATUS_CODE?.INTERNAL_SERVER_ERROR ?? 500,
      RESPONSE_STATUS?.ERROR ?? 'error',
      SERVER_MESSAGES?.SOMETHING_WENT_WRONG ?? 'Something went wrong, please try again later'
    );
  }
};
// endregion

// region exports
module.exports = errorHandler;
// endregion
