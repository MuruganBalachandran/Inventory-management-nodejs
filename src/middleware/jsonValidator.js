// region utils imports
const sendResponse = require('../utils/sendResponse');
// endregion

// region constants imports
const STATUS_CODE = require('../constants/statusCodes');
const { VALIDATION_MESSAGES } = require('../constants/messages');
// endregion

// region json validator middleware
const jsonValidator = (err, req, res, next) => {
    // check the type
    if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
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
