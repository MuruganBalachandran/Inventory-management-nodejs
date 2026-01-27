/**
 * Constants Barrel Exports
 * Exports all constants from the constants folder
 */

// region constants exports
const STATUS_CODE = require('./statusCodes');
const {
    AUTH_MESSAGES,
    USER_MESSAGES,
    INVENTORY_MESSAGES,
    VALIDATION_MESSAGES,
    SERVER_MESSAGES,
} = require('./messages');
// endregion

// region exports
module.exports = {
    STATUS_CODE,
    AUTH_MESSAGES,
    USER_MESSAGES,
    INVENTORY_MESSAGES,
    VALIDATION_MESSAGES,
    SERVER_MESSAGES,
};
// endregion
