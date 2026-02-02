// region imports
const {STATUS_CODE } = require("../../utils/constants/constants")
// endregion
// region helper - common error response
/**
 * Constructs a standardized validation error result object.
 */
const validationError = (errors) => ({
  isValid: false,
  error: errors,
  statusCode: STATUS_CODE?.BAD_REQUEST ?? 400,
});
// endregion

module.exports = {validationError};