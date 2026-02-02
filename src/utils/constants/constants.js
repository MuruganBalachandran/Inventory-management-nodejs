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
    CONFLICT: 409,
    INTERNAL_SERVER_ERROR: 500,
};

const RESPONSE_STATUS = {
    SUCCESS: 'ok',
    ERROR: 'error',
};
// endregion

// region Auth Messages
const AUTH_MESSAGES = {
    LOGIN_SUCCESS: 'Login successful',
    LOGOUT_SUCCESS: 'Logged out successfully',
    REGISTRATION_SUCCESS: 'User registered successfully',
    INVALID_CREDENTIALS: 'Invalid credentials',
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
    PASSWORD_MIN_LENGTH: 'Password must be at least 8 characters',
    AGE_MUST_BE_NUMBER: 'Age must be a number',
    NAME_REQUIRED: 'Name is required',
    NAME_STRING: 'Name must be a string, not a number or other type',
    NAME_EMPTY: 'Name cannot be empty or only whitespace',
    NAME_RESERVED: 'This name is reserved and cannot be used',
    NAME_SPACES: 'Name cannot contain multiple consecutive spaces',
    NAME_SPECIAL_START: 'Name cannot start or end with hyphens or apostrophes',
    NAME_PATTERN: 'Name can contain letters, numbers, spaces, hyphens, and apostrophes, but must include at least one letter',
    NAME_WORD_LENGTH: 'Each part of the name must be at least 2 characters',
    NAME_LENGTH_INVALID: 'Name must be 3–50 characters',
    NAME_LENGTH_INVENTORY: 'Name must be 3–100 characters',
    EMAIL_REQUIRED: 'Email is required',
    EMAIL_STRING: 'Email must be a string, not a number or other type',
    EMAIL_EMPTY: 'Email cannot be empty or only whitespace',
    EMAIL_LONG: 'Email address is too long (max 254 characters)',
    EMAIL_FORMAT: 'Invalid email format (example: user@domain.com)',
    EMAIL_DISPOSABLE: 'Temporary or disposable email addresses are not allowed',
    PASSWORD_REQUIRED: 'Password is required',
    PASSWORD_STRING: 'Password must be a string, not a number or other type',
    PASSWORD_EMPTY: 'Password cannot be empty',
    PASSWORD_MAX_LENGTH: 'Password is too long (max 128 characters)',
    PASSWORD_LOWERCASE: 'Password must contain at least one lowercase letter (a-z)',
    PASSWORD_UPPERCASE: 'Password must contain at least one uppercase letter (A-Z)',
    PASSWORD_NUMBER: 'Password must contain at least one number (0-9)',
    PASSWORD_SPECIAL: 'Password must contain at least one special character (@$!%*?&#, etc.)',
    PASSWORD_COMMON: 'This password is too common or has been found in data breaches',
    PASSWORD_REPEAT: 'Password cannot contain 3 or more repeated characters (e.g., aaa, 111)',
    PASSWORD_SEQUENCE: 'Password cannot contain sequential characters (e.g., 123, abc)',
    PASSWORD_NAME_CONTAIN: 'Password cannot contain your name',
    PASSWORD_EMAIL_CONTAIN: 'Password cannot contain your email username',
    PASSWORD_REQUIREMENTS: 'Password must be 8+ chars, with uppercase, lowercase, number, and special char',
    AGE_REQUIRED: 'Age is required',
    AGE_STRING: 'Age must be a number, not a string or other type',
    AGE_VALID: 'Age must be a valid number',
    AGE_FINITE: 'Age must be a finite number',
    AGE_WHOLE: 'Age must be a whole number (no decimals)',
    AGE_MIN: 'You must be at least 13 years old to register',
    AGE_MAX: 'Please enter a valid age (maximum 120)',
    ROLE_REQUIRED: 'Role is required',
    ROLE_STRING: 'Role must be a string',
    ROLE_INVALID: 'Invalid role',
    INVENTORY_NAME_REQUIRED: 'Inventory name is required',
    INVENTORY_NAME_STRING: 'Inventory name must be a string, not a number or other type',
    INVENTORY_NAME_EMPTY: 'Inventory name cannot be empty or only whitespace',
    INVENTORY_NAME_PATTERN: 'Inventory name must contain at least one letter or number',
    INVENTORY_NAME_SPECIAL: 'Inventory name contains too many special characters',
    INVENTORY_NAME_SPACES: 'Inventory name cannot contain multiple consecutive spaces',
    PRICE_REQUIRED: 'Price is required',
    PRICE_STRING: 'Price must be a number, not a string or other type',
    PRICE_VALID: 'Price must be a valid number',
    PRICE_FINITE: 'Price must be a finite number',
    PRICE_NEGATIVE: 'Price cannot be negative',
    PRICE_MIN: 'Price must be at least 0.01 or 0 for free items',
    PRICE_MAX: 'Price cannot exceed 99,999,999.99',
    PRICE_DECIMAL: 'Price can have at most 2 decimal places',
    QUANTITY_REQUIRED: 'Quantity is required',
    QUANTITY_STRING: 'Quantity must be a number, not a string or other type',
    QUANTITY_VALID: 'Quantity must be a valid number',
    QUANTITY_FINITE: 'Quantity must be a finite number',
    QUANTITY_WHOLE: 'Quantity must be a whole number (no decimals)',
    QUANTITY_NEGATIVE: 'Quantity cannot be negative',
    QUANTITY_MAX: 'Quantity cannot exceed 10,000,000 units',
    CATEGORY_REQUIRED: 'Category is required',
    CATEGORY_STRING: 'Category must be a string, not a number or other type',
    CATEGORY_EMPTY: 'Category cannot be empty or only whitespace',
    CATEGORY_INVALID: 'Invalid category provided',
    ID_REQUIRED: 'ID is required',
    ID_STRING: 'ID must be a string, not a number or other type',
    ID_EMPTY: 'ID cannot be empty or only whitespace',
    ID_LENGTH: 'Invalid ID format (must be 24 characters)',
    ID_HEX: 'Invalid ID format (must be hexadecimal)',
    ID_MONGO: 'Invalid ObjectId format',
    PAGE_POSITIVE: 'Page must be a positive number',
    LIMIT_POSITIVE: 'Limit must be a positive number',
    MIN_PRICE_NON_NEGATIVE: 'Minimum price must be a non-negative number',
    MAX_PRICE_NON_NEGATIVE: 'Maximum price must be a non-negative number',
    MIN_PRICE_MAX_PRICE_LOGIC: 'Minimum price cannot be greater than maximum price',
    INVALID_SORT_FIELD: 'Invalid sort field provided',
    INVALID_SORT_ORDER: 'Sort order must be either asc or desc',
    EMAIL_TYPO_SUGGESTION: 'Did you mean {email}?',
    NO_FIELDS_FOR_UPDATE: 'No fields provided for update',
    INVALID_FIELDS_UPDATE: 'You cannot update the field(s)',
    INVALID_JSON_PAYLOAD: "Invalid JSON payload"
};
// endregion

// region Server Messages
const SERVER_MESSAGES = {
    INTERNAL_SERVER_ERROR: 'Internal server error',
    SERVICE_UNAVAILABLE: 'Service temporarily unavailable',
    SOMETHING_WENT_WRONG: 'Something went wrong, please try again later',
};
// endregion

// region Database Messages
const DATABASE_MESSAGES = {
    CONNECTION_SUCCESS: 'MongoDB Connected Successfully',
    CONNECTION_FAILED: 'MongoDB Connection Failed',
    DISCONNECTED: 'MongoDB Disconnected',
    RECONNECTED: 'MongoDB Reconnected',
    RUNTIME_ERROR: 'MongoDB Runtime Error',
};
// endregion

// region Configuration Messages
const CONFIG_MESSAGES = {
    INVALID_APP_CONFIG: 'Invalid APP environment variable JSON',
    DB_URL_MISSING: 'MONGODB_URL is not defined',
    JWT_SECRET_MISSING: 'JWT_SECRET is not defined',
    CORS_NOT_ALLOWED: 'Not allowed by CORS',
};
// endregion

// region exports
module.exports = {
    STATUS_CODE,
    RESPONSE_STATUS,
    AUTH_MESSAGES,
    USER_MESSAGES,
    INVENTORY_MESSAGES,
    VALIDATION_MESSAGES,
    SERVER_MESSAGES,
    DATABASE_MESSAGES,
    CONFIG_MESSAGES,
};
// endregion
