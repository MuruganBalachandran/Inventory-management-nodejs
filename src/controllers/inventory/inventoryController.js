// region imports
// package imports
const { sendResponse } = require('../../utils/common/commonFunctions');

// model imports
const Inventory = require('../../models/inventory/inventoryModel');

// validation imports
const {
  validateCreateInventory,
  validateUpdateInventory,
  validateId,
  validateUserId,
  validateInventoryQuery,
} = require('../../validations/inventory/inventoryValidation');

// query imports
const {
  createInventoryItem,
  getAllInventoryItems,
  findInventoryById,
  updateInventoryItem,
  deleteInventoryItem,
  getInventoryItemsByUser,
} = require('../../queries/inventory/inventoryQueries');

// constants imports
const {
  STATUS_CODE,
  INVENTORY_MESSAGES,
  RESPONSE_STATUS,
} = require('../../utils/constants/constants');
const { asyncHandler } = require('../../utils/common/commonFunctions');
// endregion

// region create inventory controller
/**
 * Handles the creation of a new inventory item.
 * Associates the item with the currently logged-in user.
 */
const createInventory = asyncHandler(
  async (req, res) => {
    // validate request body
    const validation = validateCreateInventory(req.body ?? {});
    if (!validation?.isValid) {
      return sendResponse(
        res,
        validation?.statusCode ?? (STATUS_CODE?.BAD_REQUEST ?? 400),
        RESPONSE_STATUS?.ERROR ?? 'error',
        validation?.error ?? 'Invalid input'
      );
    }
    // extract fields
    const {
      Name = '',
      Price = 0,
      Quantity = 0,
      Category = 'others',
    } = req.body ?? {};

    // create inventory item in DB
    const item = await createInventoryItem({
      Name,
      Price,
      Quantity,
      Category,
      Created_By: req.user?._id,
    });

    // send success response
    return sendResponse(
      res,
      STATUS_CODE?.CREATED ?? 201,
      RESPONSE_STATUS?.SUCCESS ?? 'ok',
      INVENTORY_MESSAGES?.ITEM_CREATED ?? 'Inventory item created successfully',
      item
    );
  }
);
// endregion

// region get all inventory controller
/**
 * Fetches all active inventory items.
 * Supports pagination, filtering, and searching.
 */
const getAllInventory = asyncHandler(async (req, res) => {
  // validate query parameters
  const validation = validateInventoryQuery(req.query ?? {});
  if (!validation?.isValid) {
    return sendResponse(
      res,
      validation?.statusCode ?? (STATUS_CODE?.BAD_REQUEST ?? 400),
      RESPONSE_STATUS?.ERROR ?? 'error',
      validation?.error ?? 'Invalid query parameters'
    );
  }

  // Anyone can read all inventory items
  const ownerId = null; 

  // fetch inventory items with query params
  const result = await getAllInventoryItems({
    ownerId,
    query: req.query ?? {},
    populateUser: true,
  });

  const { items = [], pagination = {} } = result ?? {};

  if (!items?.length) {
    return sendResponse(
      res,
      STATUS_CODE?.NOT_FOUND ?? 404,
      RESPONSE_STATUS?.ERROR ?? 'error',
      INVENTORY_MESSAGES?.NO_RECORDS_FOUND ?? 'No records found'
    );
  }

  // send success response
  return sendResponse(
    res,
    STATUS_CODE?.OK ?? 200,
    RESPONSE_STATUS?.SUCCESS ?? 'ok',
    INVENTORY_MESSAGES?.ITEMS_FETCHED ?? 'Items fetched successfully',
    { items, pagination }
  );
});
// endregion

// region get inventory by id controller
/**
 * Fetches common information for a specific inventory item by its ID.
 */
const getInventoryById = asyncHandler(async (req, res) => {
  const id = req.params?.id ?? '';

  // validate inventory ID
  const validation = validateId(id);
  if (!validation?.isValid) {
    return sendResponse(
      res,
      validation?.statusCode ?? (STATUS_CODE?.BAD_REQUEST ?? 400),
      RESPONSE_STATUS?.ERROR ?? 'error',
      validation?.error ?? 'Invalid ID'
    );
  }

  // fetch inventory item by ID
  const item = await findInventoryById(id);

  if (!item) {
    return sendResponse(
      res,
      STATUS_CODE?.NOT_FOUND ?? 404,
      RESPONSE_STATUS?.ERROR ?? 'error',
      INVENTORY_MESSAGES?.ITEM_NOT_FOUND ?? 'Inventory item not found'
    );
  }

  // send success response
  return sendResponse(
    res,
    STATUS_CODE?.OK ?? 200,
    RESPONSE_STATUS?.SUCCESS ?? 'ok',
    INVENTORY_MESSAGES?.ITEMS_FETCHED ?? 'Items fetched successfully',
    item
  );
});
// endregion

// region update inventory controller
/**
 * Updates an existing inventory item.
 * Enforces ownership or admin privilege before allowing modifications.
 */
const updateInventory = asyncHandler(async (req, res) => {
  const id = req.params?.id ?? '';

  // validate inventory ID
  const idValidation = validateId(id);
  if (!idValidation?.isValid) {
    return sendResponse(
      res,
      idValidation?.statusCode ?? (STATUS_CODE?.BAD_REQUEST ?? 400),
      RESPONSE_STATUS?.ERROR ?? 'error',
      idValidation?.error ?? 'Invalid ID'
    );
  }

  // validate update fields
  const validation = validateUpdateInventory(req.body ?? {});
  if (!validation?.isValid) {
    return sendResponse(
      res,
      validation?.statusCode ?? (STATUS_CODE?.BAD_REQUEST ?? 400),
      RESPONSE_STATUS?.ERROR ?? 'error',
      validation?.error ?? 'Invalid input'
    );
  }

  // Perform existence check first to avoid 403 when 404 is appropriate
  const existingItem = await findInventoryById(id);
  if (!existingItem) {
    return sendResponse(
      res,
      STATUS_CODE?.NOT_FOUND ?? 404,
      RESPONSE_STATUS?.ERROR ?? 'error',
      INVENTORY_MESSAGES?.ITEM_NOT_FOUND ?? 'Inventory item not found'
    );
  }

  // Perform update (checking ownership)
  const isPrivileged = req.user?.Role === 'admin' || req.user?.Role === 'super_admin';
  const itemCreatorId = existingItem.Created_By?._id?.toString() ?? existingItem.Created_By?.toString();

  // Non-privileged users can only update their own items
  if (!isPrivileged && itemCreatorId !== req.user?._id?.toString()) {
    return sendResponse(
      res,
      STATUS_CODE?.FORBIDDEN ?? 403,
      RESPONSE_STATUS?.ERROR ?? 'error',
      INVENTORY_MESSAGES?.NOT_ALLOWED_TO_UPDATE ?? 'Not allowed to update this inventory item'
    );
  }

  const updated = await updateInventoryItem(id, req.user?._id, req.body ?? {}, isPrivileged);

  return sendResponse(
    res,
    STATUS_CODE?.OK ?? 200,
    RESPONSE_STATUS?.SUCCESS ?? 'ok',
    INVENTORY_MESSAGES?.ITEM_UPDATED ?? 'Inventory item updated successfully',
    updated
  );
});
// endregion

// region delete inventory controller
/**
 * Soft-deletes an inventory item.
 * Enforces ownership or admin privilege. Sets Quantity to 0.
 */
const deleteInventory = asyncHandler(async (req, res) => {
  const id = req.params?.id ?? '';

  // validate inventory ID
  const idValidation = validateId(id);
  if (!idValidation?.isValid) {
    return sendResponse(
      res,
      idValidation?.statusCode ?? (STATUS_CODE?.BAD_REQUEST ?? 400),
      RESPONSE_STATUS?.ERROR ?? 'error',
      idValidation?.error ?? 'Invalid ID'
    );
  }

  // Perform existence check first to avoid 403 when 404 is appropriate
  const existingItem = await findInventoryById(id);
  if (!existingItem) {
    return sendResponse(
      res,
      STATUS_CODE?.NOT_FOUND ?? 404,
      RESPONSE_STATUS?.ERROR ?? 'error',
      INVENTORY_MESSAGES?.ITEM_NOT_FOUND ?? 'Inventory item not found'
    );
  }

  // Perform delete (checking ownership)
  const isPrivileged = req.user?.Role === 'admin' || req.user?.Role === 'super_admin';
  const itemCreatorId = existingItem.Created_By?._id?.toString() ?? existingItem.Created_By?.toString();

  // Non-privileged users can only delete their own items
  if (!isPrivileged && itemCreatorId !== req.user?._id?.toString()) {
    return sendResponse(
      res,
      STATUS_CODE?.FORBIDDEN ?? 403,
      RESPONSE_STATUS?.ERROR ?? 'error',
      INVENTORY_MESSAGES?.NOT_ALLOWED_TO_DELETE ?? 'Not allowed to delete this inventory item'
    );
  }

  const removed = await deleteInventoryItem(id, req.user?._id, isPrivileged);

  // send success response
  return sendResponse(
    res,
    STATUS_CODE?.OK ?? 200,
    RESPONSE_STATUS?.SUCCESS ?? 'ok',
    INVENTORY_MESSAGES?.ITEM_DELETED ?? 'Inventory item deleted successfully',
    removed
  );
});
// endregion

// region get my inventory controller
/**
 * Fetches inventory items belonging strictly to the currently logged-in user.
 */
const getMyInventory = asyncHandler(async (req, res) => {
  // validate query parameters
  const validation = validateInventoryQuery(req.query ?? {});
  if (!validation?.isValid) {
    return sendResponse(
      res,
      validation?.statusCode ?? (STATUS_CODE?.BAD_REQUEST ?? 400),
      RESPONSE_STATUS?.ERROR ?? 'error',
      validation?.error ?? 'Invalid query parameters'
    );
  }

  // fetch inventory items belonging to current user
  const result = await getInventoryItemsByUser(req.user?._id, req.query ?? {});
  const { items = [], pagination = {} } = result ?? {};

  if (!items?.length) {
    return sendResponse(
      res,
      STATUS_CODE?.NOT_FOUND ?? 404,
      RESPONSE_STATUS?.ERROR ?? 'error',
      INVENTORY_MESSAGES?.NO_RECORDS_FOUND ?? 'No records found'
    );
  }

  // send success response
  return sendResponse(
    res,
    STATUS_CODE?.OK ?? 200,
    RESPONSE_STATUS?.SUCCESS ?? 'ok',
    INVENTORY_MESSAGES?.ITEMS_FETCHED ?? 'Items fetched successfully',
    { items, pagination }
  );
});
// endregion

// region get inventory by user controller
/**
 * Fetches inventory items for a specific user ID (Admin only visibility).
 */
const getInventoryByUser = asyncHandler(async (req, res) => {
  const userId = req.params?.id ?? '';

  // validate user ID
  const idValidation = validateUserId(userId);
  if (!idValidation?.isValid) {
    return sendResponse(
      res,
      idValidation?.statusCode ?? (STATUS_CODE?.BAD_REQUEST ?? 400),
      RESPONSE_STATUS?.ERROR ?? 'error',
      idValidation?.error ?? 'Invalid user ID'
    );
  }

  // validate query parameters
  const validation = validateInventoryQuery(req.query ?? {});
  if (!validation?.isValid) {
    return sendResponse(
      res,
      validation?.statusCode ?? (STATUS_CODE?.BAD_REQUEST ?? 400),
      RESPONSE_STATUS?.ERROR ?? 'error',
      validation?.error ?? 'Invalid query parameters'
    );
  }

  // fetch inventory items for specified user
  const result = await getInventoryItemsByUser(userId, req.query ?? {});
  const { items = [], pagination = {} } = result ?? {};

  if (!items?.length) {
    return sendResponse(
      res,
      STATUS_CODE?.NOT_FOUND ?? 404,
      RESPONSE_STATUS?.ERROR ?? 'error',
      INVENTORY_MESSAGES?.NO_RECORDS_FOUND ?? 'No records found'
    );
  }

  // send success response
  return sendResponse(
    res,
    STATUS_CODE?.OK ?? 200,
    RESPONSE_STATUS?.SUCCESS ?? 'ok',
    INVENTORY_MESSAGES?.ITEMS_FETCHED ?? 'Items fetched successfully',
    { items, pagination }
  );
});
// endregion

// region exports
module.exports = {
  createInventory,
  getAllInventory,
  getInventoryById,
  updateInventory,
  deleteInventory,
  getMyInventory,
  getInventoryByUser,
};
// endregion
