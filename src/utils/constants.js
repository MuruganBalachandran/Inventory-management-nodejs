/**
 * Centralized Constants File
 * Contains all status codes and messages for the application
 */

// region Status Codes
const STATUS_CODE = {
    OK: 200,
    CREATED: 201,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    INTERNAL_SERVER_ERROR: 500,
};
// endregion

// region Auth Messages
const AUTH_MESSAGES = {
    LOGIN_SUCCESS: 'Login successful',
    LOGOUT_SUCCESS: 'Logged out successfully',
    LOGOUT_ALL_SUCCESS: 'Logged out from all devices',
    REGISTRATION_SUCCESS: 'User registered successfully',
    INVALID_CREDENTIALS: 'Invalid email or password',
    PLEASE_AUTHENTICATE: 'Please authenticate',
    EMAIL_ALREADY_EXISTS: 'Email already registered',
};
// endregion

// region User Messages
const USER_MESSAGES = {
    PROFILE_FETCHED: 'Profile fetched successfully',
    PROFILE_UPDATED: 'Profile updated successfully',
    NO_CHANGES_DETECTED: 'No changes detected',
    ACCOUNT_DELETED: 'Account deleted successfully',
    USER_NOT_FOUND: 'User not found',
};
// endregion

// region Inventory Messages
const INVENTORY_MESSAGES = {
    ITEM_CREATED: 'Inventory item created successfully',
    ITEM_UPDATED: 'Inventory item updated successfully',
    ITEM_DELETED: 'Inventory item deleted successfully',
    ITEMS_FETCHED: 'Items fetched successfully',
    ITEM_NOT_FOUND: 'Inventory item not found',
    NO_RECORDS_FOUND: 'No records found',
    UNAUTHORIZED_ACCESS: 'Not allowed to access this resource',
    NOT_ALLOWED_TO_UPDATE: 'Not allowed to update this inventory item',
    NOT_ALLOWED_TO_DELETE: 'Not allowed to delete this inventory item',
};
// endregion

// region Validation Messages
const VALIDATION_MESSAGES = {
    INVALID_INPUT: 'Invalid input provided',
    INVALID_ID: 'Invalid ID',
    REQUIRED_FIELD: 'This field is required',
    INVALID_EMAIL: 'Invalid email format',
    PASSWORD_MIN_LENGTH: 'Password must be at least 6 characters',
    AGE_MUST_BE_NUMBER: 'Age must be a number',
    NAME_REQUIRED: 'Name is required',
    NAME_LENGTH_INVALID: 'Name must be 3–20 characters',
    NAME_LENGTH_INVENTORY: 'Name must be 3–50 characters',
    PRICE_REQUIRED: 'Price is required',
    PRICE_MUST_BE_POSITIVE: 'Price must be a positive number',
    QUANTITY_MUST_BE_POSITIVE: 'Quantity must be a positive number',
    EMAIL_REQUIRED: 'Email is required',
    PASSWORD_REQUIRED: 'Password is required',
    PASSWORD_REQUIREMENTS: 'Password must be 8+ chars, with uppercase, lowercase, number, and special char',
    NO_FIELDS_FOR_UPDATE: 'No fields provided for update',
    INVALID_FIELDS_UPDATE: 'You cannot update the field(s)',
};
// endregion

// region Server Messages
const SERVER_MESSAGES = {
    INTERNAL_SERVER_ERROR: 'Internal server error',
    SERVICE_UNAVAILABLE: 'Service temporarily unavailable',
    SOMETHING_WENT_WRONG: 'Something went wrong, please try again later',
};
// endregion

// region exports
module.exports = {
    STATUS_CODE,
    AUTH_MESSAGES,
    USER_MESSAGES,
    INVENTORY_MESSAGES,
    VALIDATION_MESSAGES,
    SERVER_MESSAGES,
};
// endregion
