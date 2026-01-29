// region imports
// package imports
const chalk = require('chalk');

//  utils imports
const sendResponse = require('../utils/sendResponse');

//  constants imports
const { STATUS_CODE, SERVER_MESSAGES } = require('../utils/constants');
// endregion

// region error handler middleware
// has 4 parameters → Express treats it as error handler.
const errorHandler = (err, req, res, next) => {
  try {
    // print the error
    console.error(chalk.red('[ERROR]'), err?.message || 'Unknown error');

    // status code
    const statusCode =
      err?.statusCode || err?.status || STATUS_CODE.INTERNAL_SERVER_ERROR;
    // message
    const message = err?.message || SERVER_MESSAGES.INTERNAL_SERVER_ERROR;
    // sendresponse
    return sendResponse(res, statusCode, 'error', message);
  } catch (handlerErr) {
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
