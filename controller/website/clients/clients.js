const mongoose = require('mongoose');
const Client = require('../../../models/Client');
const asyncHandler = require('../../../middleware/asyncHandler');
const ErrorResponse = require('../../../utils/errorResponse');
const Category = require('../../../models/Category');


exports.getClients = asyncHandler(async (req, res, next) => {
  let page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 100; // Increased limit for website
  const startIndex = (page - 1) * limit;
  let query = {};

  // Category filter (support both 'category' and 'categoryId')
  const categoryParam = req.query.category || req.query.categoryId;
  if (categoryParam && categoryParam.toLowerCase() !== 'all') {
    try {
      query.category = new mongoose.Types.ObjectId(categoryParam);
    } catch (err) {
      console.error('Invalid category ID:', categoryParam);
    }
  }


  // Search filter
  if (req.query.search) {
    const keyword = req.query.search;
    page = 1;
    query.$or = [
      { name: { $regex: keyword, $options: 'i' } },
      { location: { $regex: keyword, $options: 'i' } }
    ];
  }

  const total = await Client.countDocuments(query);

  const clients = await Client.find(query)
    .populate({ path: 'category', select: 'name' })
    .sort({ createdAt: -1 })
    .skip(startIndex)
    .limit(limit);

  res.status(200).json({
    success: true,
    count: clients.length,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit)
    },
    data: clients
  });
});

// @desc    Get single client
// @route   GET /api/clients/:id
// @access  Public
exports.getClient = asyncHandler(async (req, res, next) => {
  const client = await Client.findById(req.params.id).populate({ path: 'category', select: 'name' });

  if (!client) {
    return next(new ErrorResponse(`Client not found with id of ${req.params.id}`, 404));
  }

  res.status(200).json({
    success: true,
    data: client
  });
});


exports.getCategories = asyncHandler(async (req, res, next) => {
  const categories = await Category.find()

  res.status(200).json({
    success: true,
    data: categories
  });
});

