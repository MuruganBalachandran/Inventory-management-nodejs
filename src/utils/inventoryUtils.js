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
 */
const fetchInventory = async ({
  ownerId,
  query = {},
  populateUser = false,
}) => {
  // Extract and provide fallback values for props (mandatory)
  const skip = Number(query?.skip) || 0;
  const limit = Math.min(Number(query?.limit) || 20, 100);

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
};
// endregion

/**
 * Fetch Inventory Statistics Utility
 * Calculates aggregate statistics for inventory items
 * Common utility function following DRY principle - reused across multiple controllers
 *
 * @param {ObjectId} ownerId - Optional user ID to filter by owner
 * @returns {Object} - { overall, byCategory }
 */
const fetchInventoryStats = async (ownerId) => {
  // Build aggregation pipeline (invoking aggregation)
  const pipeline = [
    // Match stage: filter by owner and non-deleted items
    {
      $match: ownerId
        ? { isDeleted: 0, createdBy: ownerId }
        : { isDeleted: 0 },
    },

    // Facet stage: calculate overall and by-category stats (invoking facet)
    {
      $facet: {
        // Overall statistics for all items
        byCategory: [
          // Group by category and calculate stats (invoking group)
          {
            $group: {
              _id: '$category',
              count: { $sum: 1 },
              totalValue: { $sum: { $multiply: ['$price', '$quantity'] } },
              avgPrice: { $avg: '$price' },
              minPrice: { $min: '$price' },
              maxPrice: { $max: '$price' },
            },
          },

          // Project stage: reshape output (invoking project)
          {
            $project: {
              _id: 0,
              category: '$_id',
              count: 1,
              totalValue: 1,
              avgPrice: 1,
              minPrice: 1,
              maxPrice: 1,
            },
          },

          // Sort by total value descending (invoking sort)
          { $sort: { totalValue: -1 } },
        ],

        // Overall statistics combining all categories
        overall: [
          // Group all documents together (invoking group)
          {
            $group: {
              _id: null,
              count: { $sum: 1 },
              totalValue: { $sum: { $multiply: ['$price', '$quantity'] } },
              avgPrice: { $avg: '$price' },
              minPrice: { $min: '$price' },
              maxPrice: { $max: '$price' },
            },
          },

          // Project stage: reshape output (invoking project)
          {
            $project: {
              _id: 0,
              count: 1,
              totalValue: 1,
              avgPrice: 1,
              minPrice: 1,
              maxPrice: 1,
            },
          },
        ],
      },
    },
  ];

  // Execute aggregation pipeline (invoking Inventory.aggregate)
  const [result] = await Inventory.aggregate(pipeline);

  // Return statistics with default fallback values (providing fallback values)
  return {
    overall:
      result?.overall?.[0] ??
      {
        count: 0,
        totalValue: 0,
        avgPrice: 0,
        minPrice: 0,
        maxPrice: 0,
      },
    byCategory: result?.byCategory ?? [],
  };
};
// endregion

// region exports
module.exports = {
  fetchInventory,
  fetchInventoryStats,
};
// endregion
