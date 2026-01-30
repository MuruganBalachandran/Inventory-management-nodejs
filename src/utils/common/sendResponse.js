// region imports
// package imports
const chalk = require('chalk');
// constants imports
const { STATUS_CODE } = require('../constants/constants');
// endregion

/**
 * Ensures all API responses follow a consistent JSON format:
 * {
 *   statusCode: number,
 *   status: 'ok' | 'error',
 *   message: string,
 *   data?: any
 * }
 *
 * Logs errors to console in red for easier debugging.
 *
 *  res - Express response object
 *  statusCode - HTTP status code (default: 200 OK)
 *  status - 'ok' or 'error'
 *  message - Descriptive message
 *  data - Optional data object to include
 */
const sendResponse = (
  res,
  statusCode = STATUS_CODE.OK,
  status = 'ok',
  message = '',
  data = null
) => {
  // region Build response object
  const response = {
    statusCode,
    status,
    message,
  };

  // Include data if provided
  if (data !== null && data !== undefined) {
    response.data = data;
  }
  // endregion

  // region Log error responses for debugging
  if (status === 'error') {
    console.error(
      chalk.red(`[API ERROR - ${statusCode}]`),
      message || 'Unknown error'
    );
  }
  // endregion

  // region Send JSON response with HTTP status
  return res.status(statusCode).json(response);
  // endregion
};

// region exports
module.exports = sendResponse;
// endregion
