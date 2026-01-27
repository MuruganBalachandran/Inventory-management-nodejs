/**
 * Middleware Barrel Exports
 * Exports all middleware from the middleware folder
 */

// region middleware exports
const jsonValidator = require('./jsonValidator');
const auth = require('./auth');
const admin = require('./admin');
const logger = require('./logger');
const errorHandler = require('./errorHandler');
const notFound = require('./notFound');
// endregion

// region exports
module.exports = {
    jsonValidator,
    auth,
    admin,
    logger,
    errorHandler,
    notFound,
};
// endregion
