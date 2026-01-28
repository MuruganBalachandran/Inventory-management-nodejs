/**
 * Queries Barrel Exports
 * Exports all database query functions from the queries folder
 */

// region queries exports
const {
    createUser,
    findUserByEmail,
    findUserById,
    authenticateUserByCredentials,
    generateUserToken,
    removeUserToken,
    clearAllUserTokens,
    updateUserProfile,
    deleteUserAccount,
} = require('./userQueries');

const {
    createInventoryItem,
    findInventoryById,
    getAllInventoryItems,
    updateInventoryItem,
    deleteInventoryItem,
} = require('./inventoryQueries');
// endregion

// region exports
module.exports = {
    // User queries
    createUser,
    findUserByEmail,
    findUserById,
    authenticateUserByCredentials,
    generateUserToken,
    removeUserToken,
    clearAllUserTokens,
    updateUserProfile,
    deleteUserAccount,

    // Inventory queries
    createInventoryItem,
    findInventoryById,
    getAllInventoryItems,
    updateInventoryItem,
    deleteInventoryItem,
};
// endregion
