const Project = require('../../../models/projects');
const asyncHandler = require('../../../middleware/asyncHandler');
const ErrorResponse = require('../../../utils/errorResponse');

// @desc    Get all projects
// @route   GET /api/projects
// @access  Public
exports.getProjects = asyncHandler(async (req, res, next) => {
  let page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 10;
  const startIndex = (page - 1) * limit;
  const categoryId = req.query.category;
  let query = {};
  if(categoryId === 'All') {
    categoryId = null;
  }
  // Search filter
  if (req.query.search) {
    const keyword = req.query.search;
    page = 1;
    query.$or = [
      { title: { $regex: keyword, $options: 'i' } },
      { category: { $regex: keyword, $options: 'i' } },
      { location: { $regex: keyword, $options: 'i' } }
    ];
  }

  // Dedicated filters
  if (req.query.category && req.query.category !== 'All') {
    query.category = req.query.category;
  }
  if (req.query.status && req.query.status !== 'All') {
    query.status = req.query.status;
  }
  if (categoryId) {
    query.category = categoryId;
  }

  const total = await Project.countDocuments(query);

  const projects = await Project.find(query)
    .populate({ path: 'category', select: 'name' })
    .sort({ createdAt: -1 })
    .skip(startIndex)
    .limit(limit);

  res.status(200).json({
    success: true,
    count: projects.length,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit)
    },
    data: projects
  });
});

// @desc    Get single project
// @route   GET /api/projects/:id
// @access  Public
exports.getProject = asyncHandler(async (req, res, next) => {
  const project = await Project.findById(req.params.id).populate({ path: 'category', select: 'name' });

  if (!project) {
    return next(new ErrorResponse(`Project not found with id of ${req.params.id}`, 404));
  }

  res.status(200).json({
    success: true,
    data: project
  });
});

// @desc    Create new project
// @route   POST /api/projects
// @access  Private (Admin)
exports.createProject = asyncHandler(async (req, res, next) => {
  if (req.file) {
    req.body.image = `/uploads/${req.file.filename}`;
  }
  const project = await Project.create(req.body);
  res.status(201).json({
    success: true,
    data: project
  });
});

// @desc    Update project
// @route   PUT /api/projects/:id
// @access  Private (Admin)
exports.updateProject = asyncHandler(async (req, res, next) => {
  let project = await Project.findById(req.params.id);

  if (!project) {
    return next(new ErrorResponse(`Project not found with id of ${req.params.id}`, 404));
  }

  if (req.file) {
    req.body.image = `/uploads/${req.file.filename}`;
  }

  project = await Project.findByIdAndUpdate(req.params.id, req.body, {
    returnDocument: 'after',
    runValidators: true
  });

  res.status(200).json({
    success: true,
    data: project
  });
});

// @desc    Delete project
// @route   DELETE /api/projects/:id
// @access  Private (Admin)
exports.deleteProject = asyncHandler(async (req, res, next) => {
  const project = await Project.findById(req.params.id);

  if (!project) {
    return next(new ErrorResponse(`Project not found with id of ${req.params.id}`, 404));
  }

  await project.deleteOne();

  res.status(200).json({
    success: true,
    data: {}
  });
});
