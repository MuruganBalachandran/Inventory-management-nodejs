/**
 * Config Barrel Exports
 * Exports all configuration modules from the config folder
 */

// region config exports
const corsOptions = require('./cors');
// endregion

// region exports
module.exports = {
    corsOptions,
};
// endregion
