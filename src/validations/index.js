/**
 * Validations Barrel Exports
 * Exports all validation functions from the validations folder
 */

// region validation exports
const {
    validateSignup,
    validateLogin,
    validateUpdateProfile,
} = require('./userValidation');

const {
    validateCreateInventory,
    validateUpdateInventory,
    validateId,
    validateUserId,
} = require('./inventoryValidation');
// endregion

// region exports
module.exports = {
    validateSignup,
    validateLogin,
    validateUpdateProfile,
    validateCreateInventory,
    validateUpdateInventory,
    validateId,
    validateUserId,
};
// endregion
