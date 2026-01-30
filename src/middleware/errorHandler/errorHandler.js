// region imports
// package imports
const chalk = require('chalk');
// endregion

// region utils imports
const sendResponse = require('../../utils/common/sendResponse');
// endregion

// region constants imports
const {
  STATUS_CODE,
  SERVER_MESSAGES,
} = require('../../utils/constants/constants');
// endregion

// region error handler middleware
// Express recognizes middleware with 4 params as error handler
const errorHandler = (err, req, res, next) => {
  try {
    // log the error message in red
    console.error(chalk.red('[ERROR]'), err?.message ?? 'Unknown error');
    console.log('from global error handler');

    // determine status code; default to 500
    const statusCode =
      err?.statusCode ?? err?.status ?? STATUS_CODE.INTERNAL_SERVER_ERROR;

    // determine error message; default to generic server message
    const message = err?.message ?? SERVER_MESSAGES.INTERNAL_SERVER_ERROR;

    // send standardized error response
    return sendResponse(res, statusCode, 'error', message);
  } catch (handlerErr) {
    // fallback if error occurs inside the error handler itself
    return sendResponse(
      res,
      STATUS_CODE.INTERNAL_SERVER_ERROR,
      'error',
      SERVER_MESSAGES.SOMETHING_WENT_WRONG
    );
  }
};
// endregion

// region exports
module.exports = errorHandler;
// endregion
