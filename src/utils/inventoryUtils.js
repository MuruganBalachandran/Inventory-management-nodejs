// region model imports
const Inventory = require('../models/inventoryModel');
// endregion

// region fetch inventory optimized (single DB hit)
const fetchInventory = async ({
  ownerId,
  query = {},
  populateUser = false,
}) => {
  try {
    // Extract and validate skip/limit
    let skip = Number(query?.skip) || 0;
    let limit = Number(query?.limit) || 20;

    if (skip < 0 || !Number.isInteger(skip)) skip = 0;
    if (limit < 1 || !Number.isInteger(limit)) limit = 20;
    limit = Math.min(limit, 100);

    // Build filter
    const filter = { isDeleted: 0 };
    if (ownerId) filter.createdBy = ownerId;
    if (query?.category) filter.category = query.category;
    if (query?.name) filter.name = { $regex: query.name, $options: 'i' };

    // Build aggregation pipeline
    const pipeline = [
      // Match stage: filter documents based on `filter` object
      { $match: filter },
      // Sort stage: sort matched documents by `createdAt` descending
      { $sort: { createdAt: -1 } },
      {
        // Facet stage: perform multiple aggregations in parallel
        $facet: {
          items: [
            { $skip: skip }, // Skip `skip` number of documents (pagination)
            { $limit: limit }, // Limit results to `limit` number of documents (pagination)
            ...(populateUser  // Optional population of `createdBy` (user info)
              ? [
                  {
                    $lookup: {
                 from: 'users', // Collection to join
                  localField: 'createdBy', // Field in inventory
                  foreignField: '_id', // Field in users
                  as: 'createdBy', // Resulting field after join
                    },
                  },
                  { $unwind: '$createdBy' },
                    // Flatten the array from $lookup to a single object
                  { $project: { 
                     'createdBy.password': 0, // Exclude sensitive user fields
                      'createdBy.tokens': 0, 'createdBy.isDeleted': 0, 'createdBy.__v': 0 } },
                ]
              : []),
              // Remove internal fields from inventory items
            { $project: { isDeleted: 0, __v: 0 } },
          ],
          // `totalCount` pipeline: compute total number of matched documents
          totalCount: [{ $count: 'count' }],
        },
      },
      // Unwind totalCount to convert array to object
      { $unwind: {
         path: '$totalCount', // Convert `totalCount` array to single object
          preserveNullAndEmptyArrays: true // // Avoid errors if count is 0
         } },
    ];

    const result = await Inventory.aggregate(pipeline);

    const items = result[0]?.items ?? [];
    const count = result[0]?.totalCount?.count ?? 0;
    const totalPages = Math.ceil(count / limit);
    const currentPage = Math.floor(skip / limit) + 1;

    return {
      items,
      pagination: {
        total: count,
        count: items.length,
        skip,
        limit,
        currentPage,
        totalPages,
        hasNext: currentPage < totalPages,
        hasPrev: currentPage > 1,
      },
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
