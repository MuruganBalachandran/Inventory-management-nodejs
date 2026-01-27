// region utils imports
const {
    isNonEmptyString,
    isValidEmail,
    isValidPassword,
    isValidAge,
} = require('../utils/validationUtils');
// endregion

// region constants imports
const STATUS_CODE = require('../constants/statusCodes');
const { VALIDATION_MESSAGES } = require('../constants/messages');
// endregion

// region validate signup
const validateSignup = (data = {}) => {
    const {
        name = '',
        email = '',
        password = '',
        age,
    } = data;

    if (!isNonEmptyString(name)) {
        return {
            isValid: false,
            error: 'Name is required',
            statusCode: STATUS_CODE.BAD_REQUEST,
        };
    }

    if (name.length < 3 || name.length > 20) {
        return {
            isValid: false,
            error: 'Name must be 3–20 characters',
            statusCode: STATUS_CODE.BAD_REQUEST,
        };
    }

    if (!isNonEmptyString(email)) {
        return {
            isValid: false,
            error: 'Email is required',
            statusCode: STATUS_CODE.BAD_REQUEST,
        };
    }

    if (!isValidEmail(email)) {
        return {
            isValid: false,
            error: VALIDATION_MESSAGES.INVALID_EMAIL,
            statusCode: STATUS_CODE.BAD_REQUEST,
        };
    }

    if (!isNonEmptyString(password)) {
        return {
            isValid: false,
            error: 'Password is required',
            statusCode: STATUS_CODE.BAD_REQUEST,
        };
    }

    if (!isValidPassword(password)) {
        return {
            isValid: false,
            error: 'Password must be 8+ chars, with uppercase, lowercase, number, and special char',
            statusCode: STATUS_CODE.BAD_REQUEST,
        };
    }

    if (age !== undefined && !isValidAge(age)) {
        return {
            isValid: false,
            error: 'Age must be a positive number',
            statusCode: STATUS_CODE.BAD_REQUEST,
        };
    }

    return { isValid: true, error: null };
};
// endregion

// region validate login
const validateLogin = (data = {}) => {
    const { email = '', password = '' } = data;

    if (!isNonEmptyString(email)) {
        return {
            isValid: false,
            error: 'Email is required',
            statusCode: STATUS_CODE.BAD_REQUEST,
        };
    }

    if (!isValidEmail(email)) {
        return {
            isValid: false,
            error: VALIDATION_MESSAGES.INVALID_EMAIL,
            statusCode: STATUS_CODE.BAD_REQUEST,
        };
    }

    if (!isNonEmptyString(password)) {
        return {
            isValid: false,
            error: 'Password is required',
            statusCode: STATUS_CODE.BAD_REQUEST,
        };
    }

    return { isValid: true, error: null };
};
// endregion

// region validate update profile
const validateUpdateProfile = (data = {}) => {
    const allowedUpdates = ['name', 'password', 'age'];
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

    const { name, password, age } = data;

    if (name !== undefined) {
        if (!isNonEmptyString(name)) {
            return {
                isValid: false,
                error: 'Name is required',
                statusCode: STATUS_CODE.BAD_REQUEST,
            };
        }

        if (name.length < 3 || name.length > 20) {
            return {
                isValid: false,
                error: 'Name must be 3–20 characters',
                statusCode: STATUS_CODE.BAD_REQUEST,
            };
        }
    }

    if (password !== undefined) {
        if (!isNonEmptyString(password)) {
            return {
                isValid: false,
                error: 'Password is required',
                statusCode: STATUS_CODE.BAD_REQUEST,
            };
        }

        if (!isValidPassword(password)) {
            return {
                isValid: false,
                error: 'Password must be 8+ chars, with uppercase, lowercase, number, and special char',
                statusCode: STATUS_CODE.BAD_REQUEST,
            };
        }
    }

    if (age !== undefined && !isValidAge(age)) {
        return {
            isValid: false,
            error: 'Age must be a positive number',
            statusCode: STATUS_CODE.BAD_REQUEST,
        };
    }

    return { isValid: true, error: null };
};
// endregion

// region exports
module.exports = {
    validateSignup,
    validateLogin,
    validateUpdateProfile,
};
// endregion
