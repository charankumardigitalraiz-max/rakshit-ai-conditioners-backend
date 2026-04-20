const Project = require('../../../models/projects');
const asyncHandler = require('../../../middleware/asyncHandler');
const ErrorResponse = require('../../../utils/errorResponse');

// @desc    Get all projects
// @route   GET /api/projects
// @access  Public
exports.getProjects = asyncHandler(async (req, res, next) => {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const startIndex = (page - 1) * limit;

    let query = {};

    // Search filter
    if (req.query.search) {
        const keyword = req.query.search;
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

    const total = await Project.countDocuments(query);

    const projects = await Project.find(query)
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
    const project = await Project.findById(req.params.id);

    if (!project) {
        return next(new ErrorResponse(`Project not found with id of ${req.params.id}`, 404));
    }

    res.status(200).json({
        success: true,
        data: project
    });
});
