const Testimonial = require('../../../models/Testimonial');
const asyncHandler = require('../../../middleware/asyncHandler');
const ErrorResponse = require('../../../utils/errorResponse');

// @desc    Get all testimonials
// @route   GET /api/admin/testimonials
// @access  Private (Admin)
exports.getTestimonials = asyncHandler(async (req, res, next) => {
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 20; // 12 for grid
  const startIndex = (page - 1) * limit;

  const total = await Testimonial.countDocuments();

  const testimonials = await Testimonial.find()
    .sort({ createdAt: -1 })
    .skip(startIndex)
    .limit(limit);

  res.status(200).json({
    success: true,
    count: testimonials.length,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit)
    },
    data: testimonials
  });
});

// @desc    Create new testimonial
// @route   POST /api/admin/testimonials
// @access  Private (Admin)
// exports.createTestimonial = asyncHandler(async (req, res, next) => {
//   if (req.file) {
//     req.body.image = `/uploads/${req.file.filename}`;
//   }

//   if (!req.body.image) {
//     return next(new ErrorResponse('Please provide an image', 400));
//   }

//   const testimonial = await Testimonial.create(req.body);

//   res.status(201).json({
//     success: true,
//     data: testimonial
//   });
// });

// @desc    Delete testimonial
// @route   DELETE /api/admin/testimonials/:id
// @access  Private (Admin)
// exports.deleteTestimonial = asyncHandler(async (req, res, next) => {
//   const testimonial = await Testimonial.findById(req.params.id);

//   if (!testimonial) {
//     return next(new ErrorResponse(`Testimonial not found with id of ${req.params.id}`, 404));
//   }

//   await testimonial.deleteOne();

//   res.status(200).json({
//     success: true,
//     data: {}
//   });
// });
