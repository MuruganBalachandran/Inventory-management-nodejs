// region imports
const chalk = require('chalk');
const STATUS_CODE = require("../constants/statusCodes");
// endregion

// region sendResponse
const sendResponse = (
  res,
  statusCode = STATUS_CODE.OK,
  status = "ok",
  message = "",
  data = null,
   title = null,
) => {
  const response = {
    status,
    message,
  };

  // if error - log
  if (status === "error") {
    const logTitle = title ? `[${title}]` : "[ERROR]";
    console.error(chalk.red(`${logTitle} error:`) ,` ${message}`);
    if (data !== null) {
      console.error("Details:", data);
    }
  }

  if (data !== null) {
    response.data = data;
  }
  return res.status(statusCode).json(response);
};
// endregion

// region exports
module.exports = sendResponse;
// endregion
