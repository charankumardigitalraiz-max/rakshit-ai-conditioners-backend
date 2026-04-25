const Client = require('../../models/Client');
const asyncHandler = require('../../middleware/asyncHandler');
const ErrorResponse = require('../../utils/errorResponse');
const Category = require('../../models/Category');
// @desc    Get all clients
// @route   GET /api/admin/clients
// @access  Private (Admin)
exports.getClients = asyncHandler(async (req, res, next) => {
  let page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 10;
  const startIndex = (page - 1) * limit;
  let categoryId = req.query.category;
  let query = {};

  if (categoryId === 'All') {
    categoryId = null;
  }

  // Search filter
  if (req.query.search) {
    const keyword = req.query.search;
    page = 1;

    // Find categories matching the keyword

    const matchingCategories = await Category.find({
      name: { $regex: keyword, $options: 'i' }
    }).select('_id');

    const categoryIds = matchingCategories.map(cat => cat._id);

    query.$or = [
      { name: { $regex: keyword, $options: 'i' } },
      { location: { $regex: keyword, $options: 'i' } },
      { category: { $in: categoryIds } }
    ];
  }

  // Filter by category if provided
  if (categoryId) {
    query.category = categoryId;
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
// @route   GET /api/admin/clients/:id
// @access  Private (Admin)
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

// @desc    Create new client
// @route   POST /api/admin/clients
// @access  Private (Admin)
exports.createClient = asyncHandler(async (req, res, next) => {
  if (req.file) {
    req.body.image = `/uploads/${req.file.filename}`;
  }

  const client = await Client.create(req.body);

  res.status(201).json({
    success: true,
    data: client
  });
});

// @desc    Update client
// @route   PUT /api/admin/clients/:id
// @access  Private (Admin)
exports.updateClient = asyncHandler(async (req, res, next) => {
  let client = await Client.findById(req.params.id);

  if (!client) {
    return next(new ErrorResponse(`Client not found with id of ${req.params.id}`, 404));
  }

  if (req.file) {
    req.body.image = `/uploads/${req.file.filename}`;
  }

  client = await Client.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  res.status(200).json({
    success: true,
    data: client
  });
});

// @desc    Delete client
// @route   DELETE /api/admin/clients/:id
// @access  Private (Admin)
exports.deleteClient = asyncHandler(async (req, res, next) => {
  const client = await Client.findById(req.params.id);

  if (!client) {
    return next(new ErrorResponse(`Client not found with id of ${req.params.id}`, 404));
  }

  await client.deleteOne();

  res.status(200).json({
    success: true,
    data: {}
  });
});
