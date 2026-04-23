const Category = require('../../models/category');
const ErrorResponse = require('../../utils/errorResponse');
const asyncHandler = require('../../middleware/asyncHandler');
// Get all categories
exports.getCategories = asyncHandler(async (req, res, next) => {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const startIndex = (page - 1) * limit;

    let query = {};

    // Search filter
    if (req.query.search) {
        const keyword = req.query.search;
        query.$or = [
            { name: { $regex: keyword, $options: 'i' } },
            { location: { $regex: keyword, $options: 'i' } }
        ];
    }

    const total = await Category.countDocuments(query);

    const categories = await Category.find(query)
        .sort({ createdAt: -1 })
    // .skip(startIndex)
    // .limit(limit);

    res.status(200).json({
        success: true,
        count: categories.length,
        pagination: {
            page,
            limit,
            total,
            pages: Math.ceil(total / limit)
        },
        data: categories
    });
});

// @desc    Get single client
// @route   GET /api/admin/categories/:id
// @access  Private (Admin)
exports.getCategory = asyncHandler(async (req, res, next) => {
    const categories = await Category.findById(req.params.id);

    if (!categories) {
        return next(new ErrorResponse(`Category not found with id of ${req.params.id}`, 404));
    }

    res.status(200).json({
        success: true,
        data: categories
    });
});

// @desc    Create new client
// @route   POST /api/admin/categories
// @access  Private (Admin)
exports.createCategory = asyncHandler(async (req, res, next) => {
    if (req.file) {
        req.body.image = `/uploads/${req.file.filename}`;
    }
    console.log(req.body);
    const categories = await Category.create(req.body);

    res.status(201).json({
        success: true,
        data: categories
    });
});

// @desc    Update client
// @route   PUT /api/admin/categories/:id
// @access  Private (Admin)
exports.updateCategory = asyncHandler(async (req, res, next) => {
    let categories = await Category.findById(req.params.id);

    if (!categories) {
        return next(new ErrorResponse(`Categories not found with id of ${req.params.id}`, 404));
    }

    if (req.file) {
        req.body.image = `/uploads/${req.file.filename}`;
    }

    categories = await Category.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    });

    res.status(200).json({
        success: true,
        data: categories
    });
});

// @desc    Delete client
// @route   DELETE /api/admin/categories/:id
// @access  Private (Admin)
exports.deleteCategory = asyncHandler(async (req, res, next) => {
    const categories = await Category.findById(req.params.id);

    if (!categories) {
        return next(new ErrorResponse(`Categories not found with id of ${req.params.id}`, 404));
    }

    await categories.deleteOne();

    res.status(200).json({
        success: true,
        data: {}
    });
});