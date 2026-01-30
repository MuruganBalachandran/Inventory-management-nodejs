// region imports
const {STATUS_CODE } = require("../../utils/constants/constants")
// endregion
// region helper - common error response
/*
  Creates a standard validation error object
  Now accepts an array of errors
*/
const validationError = (errors) => ({
  isValid: false,
  error: errors,
  statusCode: STATUS_CODE.BAD_REQUEST,
});
// endregion

module.exports = {validationError};