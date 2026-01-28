// region utils imports
const {
    isValidObjectId,
    isNonEmptyString,
    isPositiveInteger,
} = require('../utils/validationUtils');
// endregion

// region constants imports
const { STATUS_CODE, VALIDATION_MESSAGES } = require('../utils/constants');
// endregion

// region validate create inventory
const validateCreateInventory = (data = {}) => {
    const {
        name = '',
        price,
        quantity,
        category,
    } = data;

    if (!isNonEmptyString(name)) {
        return {
            isValid: false,
            error: VALIDATION_MESSAGES.NAME_REQUIRED,
            statusCode: STATUS_CODE.BAD_REQUEST,
        };
    }

    if (name.length < 3 || name.length > 50) {
        return {
            isValid: false,
            error: VALIDATION_MESSAGES.NAME_LENGTH_INVENTORY,
            statusCode: STATUS_CODE.BAD_REQUEST,
        };
    }

    if (price === undefined) {
        return {
            isValid: false,
            error: VALIDATION_MESSAGES.PRICE_REQUIRED,
            statusCode: STATUS_CODE.BAD_REQUEST,
        };
    }

    if (!isPositiveInteger(price)) {
        return {
            isValid: false,
            error: VALIDATION_MESSAGES.PRICE_MUST_BE_POSITIVE,
            statusCode: STATUS_CODE.BAD_REQUEST,
        };
    }

    if (quantity !== undefined && !isPositiveInteger(quantity)) {
        return {
            isValid: false,
            error: VALIDATION_MESSAGES.QUANTITY_MUST_BE_POSITIVE,
            statusCode: STATUS_CODE.BAD_REQUEST,
        };
    }

    return { isValid: true, error: null };
};
// endregion

// region validate update inventory
const validateUpdateInventory = (data = {}) => {
    const allowedUpdates = ['name', 'price', 'quantity', 'category'];
    const updates = Object.keys(data);

    if (updates.length === 0) {
        return {
            isValid: false,
            error: VALIDATION_MESSAGES.NO_FIELDS_FOR_UPDATE,
            statusCode: STATUS_CODE.BAD_REQUEST,
        };
    }

    const invalidFields = updates.filter(
        (key) => !allowedUpdates.includes(key)
    );
    if (invalidFields.length > 0) {
        return {
            isValid: false,
            error: `${VALIDATION_MESSAGES.INVALID_FIELDS_UPDATE}: ${invalidFields.join(', ')}`,
            statusCode: STATUS_CODE.BAD_REQUEST,
        };
    }

    const { name, price, quantity, category } = data;

    if (name !== undefined) {
        if (!isNonEmptyString(name)) {
            return {
                isValid: false,
                error: VALIDATION_MESSAGES.NAME_REQUIRED,
                statusCode: STATUS_CODE.BAD_REQUEST,
            };
        }

        if (name.length < 3 || name.length > 50) {
            return {
                isValid: false,
                error: VALIDATION_MESSAGES.NAME_LENGTH_INVENTORY,
                statusCode: STATUS_CODE.BAD_REQUEST,
            };
        }
    }

    if (price !== undefined && !isPositiveInteger(price)) {
        return {
            isValid: false,
            error: VALIDATION_MESSAGES.PRICE_MUST_BE_POSITIVE,
            statusCode: STATUS_CODE.BAD_REQUEST,
        };
    }

    if (quantity !== undefined && !isPositiveInteger(quantity)) {
        return {
            isValid: false,
            error: VALIDATION_MESSAGES.QUANTITY_MUST_BE_POSITIVE,
            statusCode: STATUS_CODE.BAD_REQUEST,
        };
    }

    return { isValid: true, error: null };
};
// endregion

// region validate id
const validateId = (id = '') => {
    if (!isValidObjectId(id)) {
        return {
            isValid: false,
            error: VALIDATION_MESSAGES.INVALID_ID,
            statusCode: STATUS_CODE.BAD_REQUEST,
        };
    }

    return { isValid: true, error: null };
};
// endregion

// region validate user id
const validateUserId = (userId = '') => {
    if (!isValidObjectId(userId)) {
        return {
            isValid: false,
            error: VALIDATION_MESSAGES.INVALID_ID,
            statusCode: STATUS_CODE.BAD_REQUEST,
        };
    }

    return { isValid: true, error: null };
};
// endregion

// region exports
module.exports = {
    validateCreateInventory,
    validateUpdateInventory,
    validateId,
    validateUserId,
};
// endregion
