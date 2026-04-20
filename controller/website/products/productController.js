const Product = require('../../../models/products');
const asyncHandler = require('../../../middleware/asyncHandler');
const ErrorResponse = require('../../../utils/errorResponse');

// @desc    Get all products
// @route   GET /api/products
// @access  Public
exports.getProducts = asyncHandler(async (req, res, next) => {
    let query = {};

    // Search filter
    if (req.query.search) {
        const keyword = req.query.search;
        query.$or = [
            { name: { $regex: keyword, $options: 'i' } },
            { category: { $regex: keyword, $options: 'i' } },
            { series: { $regex: keyword, $options: 'i' } }
        ];
    }

    // Dedicated filters
    if (req.query.category && req.query.category !== 'All') {
        query.category = req.query.category;
    }
    if (req.query.stockStatus && req.query.stockStatus !== 'All') {
        query.stockStatus = req.query.stockStatus;
    }

    // Performance Optimization for "Any Size" data:
    // 1. .lean() -> returns plain JS objects, bypassing Mongoose document overhead (3-5x faster)
    // 2. .select() -> Positive selection: only fetch the small subset of fields needed for listing cards.
    // This dramatically reduces payload size and memory usage for large product sets.
    const products = await Product.find(query)
        .select('name category series image images variants hasPlaceholderImage placeholderText stockStatus')
        .sort({ createdAt: -1 })
        .lean();

    res.status(200).json({
        success: true,
        count: products.length,
        data: products
    });
});

// @desc    Get single product
// @route   GET /api/products/:id
// @access  Public
exports.getProduct = asyncHandler(async (req, res, next) => {
    const product = await Product.findById(req.params.id);

    if (!product) {
        return next(new ErrorResponse(`Product not found with id of ${req.params.id}`, 404));
    }

    res.status(200).json({
        success: true,
        data: product
    });
});


