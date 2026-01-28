// region model imports
const Inventory = require('../models/inventoryModel');
// endregion

/**
 * Fetch Inventory Items Utility
 * Retrieves inventory items with optional filtering, pagination, and user population
 * Common utility function following DRY principle - reused across multiple controllers
 *
 * @param {Object} options - Configuration options
 * @param {ObjectId} options.ownerId - Optional user ID to filter by owner
 * @param {Object} options.query - Query parameters (skip, limit, category, name)
 * @param {Boolean} options.populateUser - Whether to populate createdBy user info
 * @returns {Object} - { count, items, skip, limit }
 * @throws {Error} If database query fails
 */
const fetchInventory = async ({
  ownerId,
  query = {},
  populateUser = false,
}) => {
  try {
    // Extract and provide fallback values for props (mandatory)
    let skip = Number(query?.skip) || 0;
    let limit = Number(query?.limit) || 20;

    // Validate and sanitize skip parameter
    if (skip < 0) skip = 0;
    if (!Number.isInteger(skip)) skip = 0;

    // Validate and sanitize limit parameter
    if (limit < 1) limit = 20;
    if (!Number.isInteger(limit)) limit = 20;
    limit = Math.min(limit, 100); // Max 100 items per page

    // Build filter object (invoking filter construction)
    const filter = { isDeleted: 0 };

    // Add owner filter if provided
    if (ownerId) {
      filter.createdBy = ownerId;
    }

    // Add category filter if provided
    if (query?.category) {
      filter.category = query.category;
    }

    // Add name search filter with case-insensitive regex
    if (query?.name) {
      filter.name = { $regex: query.name, $options: 'i' };
    }

    // Build query with filters and sorting (invoking Inventory.find)
    let queryBuilder = Inventory.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    // Populate user information if requested (invoking populate)
    if (populateUser) {
      queryBuilder = queryBuilder.populate('createdBy', 'name email');
    }

    // Execute both count and items queries in parallel (invoking Promise.all)
    const [count, items] = await Promise.all([
      Inventory.countDocuments(filter),
      queryBuilder.lean(),
    ]);

    // Return paginated results with metadata
    return {
      count,
      items: items ?? [],
      skip,
      limit,
    };
  } catch (err) {
    console.error('[fetchInventory Error]', err);
    throw err;
  }
};
// endregion

// region exports
module.exports = {
  fetchInventory,
};
// endregion
