// region utils imports
const sendResponse = require('../utils/sendResponse');
// endregion

// region constants imports
const { STATUS_CODE, VALIDATION_MESSAGES } = require('../utils/constants');
// endregion

// region json validator middleware
const jsonValidator = (err, req, res, next) => {
    // check the type
    //SyntaxError-  built-in error class
    if (
        err instanceof SyntaxError // Checks the type of error object.
        && err.status === 400  // BAD REQUEST
        && 'body' in err //  Error came from request body parsing
    ) {
        return sendResponse(
            res,
            STATUS_CODE.BAD_REQUEST,
            'error',
            VALIDATION_MESSAGES.INVALID_INPUT
        );
    }

    next();
};
// endregion

// region exports
module.exports = jsonValidator;
// endregion
