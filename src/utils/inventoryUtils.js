// region imports
const Inventory = require("../models/inventoryModel");
// endregion

// region fetch inventories from the user
const fetchInventory = async ({ ownerId, query,populateUser = false }) => {
  const skip = Number(query.skip) || 0;
  const limit = Math.min(Number(query.limit) || 20, 100);

  const filter = { isDeleted: 0 };
  if (ownerId) filter.createdBy = ownerId;

  if (query.category) filter.category = query.category;
  if (query.name) filter.name = { $regex: query.name, $options: "i" };
let queryBuilder = Inventory.find(filter)
  .sort({ createdAt: -1 })
  .skip(skip)
  .limit(limit);
  if (populateUser) {
  queryBuilder = queryBuilder.populate("createdBy", "name email");
}

const [count, items] = await Promise.all([
  Inventory.countDocuments(filter),
  queryBuilder.lean(),
]);

  return { count, items, skip, limit };
};

// region fetch inventory stats from the user
const fetchInventoryStats = async (ownerId) => {
  const pipeline = [
    { $match: ownerId ? { isDeleted: 0, createdBy: ownerId } : { isDeleted: 0 } },
    {
      $facet: {
        byCategory: [
          {
            $group: {
              _id: "$category",
              count: { $sum: 1 },
              totalValue: { $sum: { $multiply: ["$price", "$quantity"] } },
              avgPrice: { $avg: "$price" },
              minPrice: { $min: "$price" },
              maxPrice: { $max: "$price" },
            },
          },
          {
            $project: {
              _id: 0,
              category: "$_id",
              count: 1,
              totalValue: 1,
              avgPrice: 1,
              minPrice: 1,
              maxPrice: 1,
            },
          },
          { $sort: { totalValue: -1 } },
        ],
        overall: [
          {
            $group: {
              _id: null,
              count: { $sum: 1 },
              totalValue: { $sum: { $multiply: ["$price", "$quantity"] } },
              avgPrice: { $avg: "$price" },
              minPrice: { $min: "$price" },
              maxPrice: { $max: "$price" },
            },
          },
          { $project: { _id: 0, count: 1, totalValue: 1, avgPrice: 1, minPrice: 1, maxPrice: 1 } },
        ],
      },
    },
  ];

  const [result] = await Inventory.aggregate(pipeline);
  return {
    overall: result?.overall?.[0] || { count: 0, totalValue: 0, avgPrice: 0, minPrice: 0, maxPrice: 0 },
    byCategory: result?.byCategory || [],
  };
};

module.exports = { fetchInventory, fetchInventoryStats };
