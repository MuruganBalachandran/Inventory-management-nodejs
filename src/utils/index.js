/**
 * Utils Barrel Exports
 * Exports all utility functions from the utils folder
 */

// region utils exports
const sendResponse = require('./sendResponse');
const {
    fetchInventory,
    fetchInventoryStats,
} = require('./inventoryUtils');
const {
    validateEmail,
    validatePassword,
    isValidObjectId,
} = require('./validationUtils');
const {
    hashPassword,
    verifyPassword,
} = require('./hashUtil');
const {
    generateToken,
    verifyToken,
    decodeToken,
} = require('./jwtUtil');
// endregion

// region exports
module.exports = {
    sendResponse,
    fetchInventory,
    fetchInventoryStats,
    validateEmail,
    validatePassword,
    isValidObjectId,
    hashPassword,
    verifyPassword,
    generateToken,
    verifyToken,
    decodeToken,
};
// endregion
