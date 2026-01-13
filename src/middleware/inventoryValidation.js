// region imports
const sendResponse = require("../utils/sendResponse");
const STATUS_CODE = require("../constants/statusCodes");
const {
    isValidObjectId,
  isNonEmptyString,
  isPositiveInteger,
} = require("../utils/validationUtils");
// endregion

// region Inventory validation
const createInventoryValidation = (req, res, next) => {
  const { name, price, quantity, category } = req.body;
// name
  if (!isNonEmptyString(name)) {
    return sendResponse(
      res,
      STATUS_CODE.BAD_REQUEST,
      "error",
      "Name is required",
      null,
      "create Inventory Validation"
    );
  }

  if (name.length < 3 || name.length > 50) {
    return sendResponse(
      res,
      STATUS_CODE.BAD_REQUEST,
      "error",
      "Name must be 3–50 characters",
          null,
      "create Inventory Validation"
    );
  }
// price
  if (price === undefined) {
    return sendResponse(
      res,
      STATUS_CODE.BAD_REQUEST,
      "error",
      "Price is required",
          null,
      "create Inventory Validation"
    );
  }

  if (!isPositiveInteger(price)) {
    return sendResponse(
      res,
      STATUS_CODE.BAD_REQUEST,
      "error",
      "Price must be a positive integer",
          null,
      "create Inventory Validation"
    );
  }
// quantity
  if (quantity !== undefined && !isPositiveInteger(quantity)) {
    return sendResponse(
      res,
      STATUS_CODE.BAD_REQUEST,
      "error",
      "Quantity must be a positive integer",
          null,
      "create Inventory Validation"
    );
  }

  next();
};
// endregion
const updateInventoryValidation = (req, res, next) => {
  const allowedUpdates = ["name", "price", "quantity", "category"];
  const updates = Object.keys(req.body);
// check for no update
  if (updates.length === 0) {
    return sendResponse(
      res,
      STATUS_CODE.BAD_REQUEST,
      "error",
      "No fields provided for update",
          null,
      "update Inventory Validation"
    );
  }
// check for invalid field update
  const invalidFields = updates.filter(key => !allowedUpdates.includes(key));
  if (invalidFields.length) {
    return sendResponse(
      res,
      STATUS_CODE.BAD_REQUEST,
      "error",
      `You cannot update the field(s): ${invalidFields.join(", ")}`,
          null,
      "update Inventory Validation"
    );
  }

  const { name, price, quantity, category } = req.body;
// name
  if (name !== undefined && !isNonEmptyString(name)) {
    return sendResponse(
      res,
      STATUS_CODE.BAD_REQUEST,
      "error",
      "Name is required",
          null,
      "update Inventory Validation"
    );
  }

  if (name !== undefined && (name.length < 3 || name.length > 50)) {
    return sendResponse(
      res,
      STATUS_CODE.BAD_REQUEST,
      "error",
      "Name must be 3–50 characters",
          null,
      "update Inventory Validation"
    );
  }
// price
  if (price !== undefined && !isPositiveInteger(price)) {
    return sendResponse(
      res,
      STATUS_CODE.BAD_REQUEST,
      "error",
      "Price must be a positive integer",
          null,
      "update Inventory Validation"
    );
  }
// quantity
  if (quantity !== undefined && !isPositiveInteger(quantity)) {
    return sendResponse(
      res,
      STATUS_CODE.BAD_REQUEST,
      "error",
      "Quantity must be a positive integer",
          null,
      "update Inventory Validation"
    );
  }

  next();
};


const idParamValidation = (req, res, next) => {
  if (!isValidObjectId(req.params.id)) {
    return sendResponse(res, STATUS_CODE.BAD_REQUEST, "error", "Invalid ID",null,"id param param validation");
  }
  next();
};

const userIdParamValidation = (req, res, next) => {
  if (!isValidObjectId(req.params.userId)) {
    return sendResponse(res, STATUS_CODE.BAD_REQUEST, "error", "Invalid user ID",null, "user if param validation");
  }
  next();
};

module.exports = {
  createInventoryValidation,
  updateInventoryValidation,
  idParamValidation,
  userIdParamValidation,
};
