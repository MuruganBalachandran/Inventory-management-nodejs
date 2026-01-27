// region utils imports
const {
    isValidObjectId,
    isNonEmptyString,
    isPositiveInteger,
} = require('../utils/validationUtils');
// endregion

// region constants imports
const STATUS_CODE = require('../constants/statusCodes');
const { VALIDATION_MESSAGES } = require('../constants/messages');
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
            error: 'Name is required',
            statusCode: STATUS_CODE.BAD_REQUEST,
        };
    }

    if (name.length < 3 || name.length > 50) {
        return {
            isValid: false,
            error: 'Name must be 3–50 characters',
            statusCode: STATUS_CODE.BAD_REQUEST,
        };
    }

    if (price === undefined) {
        return {
            isValid: false,
            error: 'Price is required',
            statusCode: STATUS_CODE.BAD_REQUEST,
        };
    }

    if (!isPositiveInteger(price)) {
        return {
            isValid: false,
            error: 'Price must be a positive number',
            statusCode: STATUS_CODE.BAD_REQUEST,
        };
    }

    if (quantity !== undefined && !isPositiveInteger(quantity)) {
        return {
            isValid: false,
            error: 'Quantity must be a positive number',
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
            error: 'No fields provided for update',
            statusCode: STATUS_CODE.BAD_REQUEST,
        };
    }

    const invalidFields = updates.filter(
        (key) => !allowedUpdates.includes(key)
    );
    if (invalidFields.length > 0) {
        return {
            isValid: false,
            error: `You cannot update the field(s): ${invalidFields.join(', ')}`,
            statusCode: STATUS_CODE.BAD_REQUEST,
        };
    }

    const { name, price, quantity, category } = data;

    if (name !== undefined) {
        if (!isNonEmptyString(name)) {
            return {
                isValid: false,
                error: 'Name is required',
                statusCode: STATUS_CODE.BAD_REQUEST,
            };
        }

        if (name.length < 3 || name.length > 50) {
            return {
                isValid: false,
                error: 'Name must be 3–50 characters',
                statusCode: STATUS_CODE.BAD_REQUEST,
            };
        }
    }

    if (price !== undefined && !isPositiveInteger(price)) {
        return {
            isValid: false,
            error: 'Price must be a positive number',
            statusCode: STATUS_CODE.BAD_REQUEST,
        };
    }

    if (quantity !== undefined && !isPositiveInteger(quantity)) {
        return {
            isValid: false,
            error: 'Quantity must be a positive number',
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
            error: 'Invalid user ID',
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
