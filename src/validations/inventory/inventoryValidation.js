// region imports
const {
  validateInventoryName,
  validatePrice,
  validateQuantity,
  validateCategory,
  validateObjectId,
} = require('../helpers/typeValidations');

const { validationError } = require('../helpers/validationError');
const { VALIDATION_MESSAGES } = require('../../utils/constants/constants');
// endregion

// region validate create inventory
/**
 * Validates inventory creation
 * Fields: Name, Price, Quantity, Category
 */
const validateCreateInventory = (data = {}) => {
  const errors = [];

  const { Name, Price, Quantity, Category } = data;

  // region Name
  const nameError = validateInventoryName(Name);
  if (nameError) {
    errors.push(nameError);
  }
  // endregion

  // region Price
  const priceError = validatePrice(Price);
  if (priceError) {
    errors.push(priceError);
  }
  // endregion

  // region Quantity (optional)
  if (Quantity !== undefined) {
    const qtyError = validateQuantity(Quantity);
    if (qtyError) {
      errors.push(qtyError);
    }
  }
  // endregion

  // region Category (optional but validated if provided)
  if (Category !== undefined) {
    const categoryError = validateCategory(Category);
    if (categoryError) {
      errors.push(categoryError);
    }
  }
  // endregion

  // region result
  if (errors.length > 0) {
    return validationError(errors);
  }

  return { isValid: true, error: null };
  // endregion
};
// endregion

// region validate update inventory
/**
 * Validates inventory update
 * Only allows: Name, Price, Quantity, Category
 */
const validateUpdateInventory = (data = {}) => {
  const allowedUpdates = ['Name', 'Price', 'Quantity', 'Category'];
  const updates = Object.keys(data);
  const errors = [];

  // region no fields
  if (updates.length === 0) {
    errors.push(VALIDATION_MESSAGES.NO_FIELDS_FOR_UPDATE);
  }
  // endregion

  // region invalid fields
  const invalidFields = updates.filter((key) => !allowedUpdates.includes(key));
  if (invalidFields.length > 0) {
    errors.push(
      `${VALIDATION_MESSAGES.INVALID_FIELDS_UPDATE}: ${invalidFields.join(', ')}`
    );
  }
  // endregion

  const { Name, Price, Quantity, Category } = data;

  // region Name
  if (Name !== undefined) {
    const nameError = validateInventoryName(Name);
    if (nameError) {
      errors.push(nameError);
    }
  }
  // endregion

  // region Price
  if (Price !== undefined) {
    const priceError = validatePrice(Price);
    if (priceError) {
      errors.push(priceError);
    }
  }
  // endregion

  // region Quantity
  if (Quantity !== undefined) {
    const qtyError = validateQuantity(Quantity);
    if (qtyError) {
      errors.push(qtyError);
    }
  }
  // endregion

  // region Category
  if (Category !== undefined) {
    const categoryError = validateCategory(Category);
    if (categoryError) {
      errors.push(categoryError);
    }
  }
  // endregion

  // region result
  if (errors.length > 0) {
    return validationError(errors);
  }

  return { isValid: true, error: null };
  // endregion
};
// endregion

// region validate id
const validateId = (id = '') => {
  const idError = validateObjectId(id);
  if (idError) {
    return validationError([idError]);
  }

  return { isValid: true, error: null };
};
// endregion

// region validate user id
const validateUserId = (userId = '') => {
  const idError = validateObjectId(userId);
  if (idError) {
    return validationError([idError]);
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
