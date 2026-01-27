/**
 * Models Barrel Exports
 * Exports all database models from the models folder
 */

// region models exports
const User = require('./userModel');
const Inventory = require('./inventoryModel');
// endregion

// region exports
module.exports = {
    User,
    Inventory,
};
// endregion
