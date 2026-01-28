// region package imports
const chalk = require('chalk');
// endregion

// region constants imports
const { STATUS_CODE } = require('./constants');
// endregion

/**
 * Standardized Response Sender
 * Ensures all API responses follow consistent format:
 * { status, message, data? }
 */
const sendResponse = (
  res,
  statusCode = STATUS_CODE.OK,
  status = 'ok',
  message = '',
  data = null
) => {
  // Build response object
  const response = {
    statusCode,
    status,
    message,
  };

  // Include data if provided
  if (data !== null && data !== undefined) {
    response.data = data;
  }

  // Log error responses for debugging
  if (status === 'error') {
    console.error(
      chalk.red(`[API ERROR - ${statusCode}]`),
      message || 'Unknown error'
    );
  }

  // Send JSON response with status code
  return res.status(statusCode).json(response);
};
// endregion

// region exports
module.exports = sendResponse;
// endregion
