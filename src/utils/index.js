/**
 * Utils Barrel Exports
 * Exports all utility functions from the utils folder
 */

// region utils exports
const sendResponse = require('./sendResponse');
const asyncHandler = require('./asyncHandler');
const {
    fetchInventory,
} = require('./inventoryUtils');
const {
    isValidObjectId,
} = require('./validationUtils');
const {
    hashPassword,
    verifyPassword,
} = require('./hashUtil');
const {
    generateToken,
    verifyToken,
} = require('./jwtUtil');
// endregion

// region exports
module.exports = {
    sendResponse,
    asyncHandler,
    fetchInventory,
    isValidObjectId,
    hashPassword,
    verifyPassword,
    generateToken,
    verifyToken,
};
// endregion
