const Achievement = require('../../../models/achievements');
const asyncHandler = require('../../../middleware/asyncHandler');
const ErrorResponse = require('../../../utils/errorResponse');

// @desc    Get all achievements
// @route   GET /api/achievements
// @access  Public
exports.getAchievements = asyncHandler(async (req, res, next) => {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const startIndex = (page - 1) * limit;

    let query = {};
    if (req.query.search) {
        query.title = { $regex: req.query.search, $options: 'i' };
    }

    const total = await Achievement.countDocuments(query);

    const achievements = await Achievement.find(query)
        .sort({ createdAt: -1 })
        .skip(startIndex)
        .limit(limit);

    res.status(200).json({
        success: true,
        count: achievements.length,
        pagination: {
            page,
            limit,
            total,
            pages: Math.ceil(total / limit)
        },
        data: achievements
    });
});

// @desc    Get single achievement
// @route   GET /api/achievements/:id
// @access  Public
exports.getAchievement = asyncHandler(async (req, res, next) => {
    const achievement = await Achievement.findById(req.params.id);

    if (!achievement) {
        return next(new ErrorResponse(`Achievement not found with id of ${req.params.id}`, 404));
    }

    res.status(200).json({
        success: true,
        data: achievement
    });
});
