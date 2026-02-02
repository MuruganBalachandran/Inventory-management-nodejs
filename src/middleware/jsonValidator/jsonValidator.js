// region utils imports
const { sendResponse } = require('../../utils/common/commonFunctions');
// endregion

// region constants imports
const { STATUS_CODE, VALIDATION_MESSAGES, RESPONSE_STATUS } = require('../../utils/constants/constants');
// endregion

// region json validator middleware
/**
 * Intercepts JSON parsing errors from express.json().
 * Responds with 400 Bad Request if the JSON payload is malformed.
 */
const jsonValidator = (err, req, res, next) => {
    // check the type
    //SyntaxError-  built-in error class
    if (
        err instanceof SyntaxError // Checks the type of error object.
        && (err.status === 400 || err.statusCode === 400) // BAD REQUEST
        && 'body' in err //  Error came from request body parsing
    ) {
        return sendResponse(
            res,
            STATUS_CODE?.BAD_REQUEST ?? 400,
            RESPONSE_STATUS?.ERROR ?? 'error',
            VALIDATION_MESSAGES?.INVALID_JSON_PAYLOAD ?? 'Invalid JSON payload'
        );
    }
    next();
};
// endregion

// region exports
module.exports = jsonValidator;
// endregion
