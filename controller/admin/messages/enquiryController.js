const Enquiry = require('../../../models/Enquiry');
const asyncHandler = require('../../../middleware/asyncHandler');
const ErrorResponse = require('../../../utils/errorResponse');

// @desc    Get all enquiries
// @route   GET /api/enquiries
// @access  Private (Admin)
exports.getEnquiries = asyncHandler(async (req, res, next) => {
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 10;
  const startIndex = (page - 1) * limit;

  let matchQuery = {};

  // Search filter (name, email, message)
  if (req.query.search) {
    const keyword = req.query.search;
    matchQuery.$or = [
      { fullName: { $regex: keyword, $options: 'i' } },
      { details: { $regex: keyword, $options: 'i' } },
      { interest: { $regex: keyword, $options: 'i' } }
    ];
  }

  // Status filter
  if (req.query.status && req.query.status !== 'All') {
    matchQuery.status = req.query.status;
  }

  const results = await Enquiry.aggregate([
    { $match: matchQuery },
    {
      $lookup: {
        from: 'products',
        let: { p_id: '$product' },
        pipeline: [
          {
            $match: {
              $expr: {
                $or: [
                  { $eq: ['$slug', '$$p_id'] },
                  {
                    $eq: [
                      '$_id',
                      { $convert: { input: '$$p_id', to: 'objectId', onError: null, onNull: null } }
                    ]
                  }
                ]
              }
            }
          }
        ],
        as: 'product'
      }
    },
    { $unwind: { path: '$product', preserveNullAndEmptyArrays: true } },
    {
      $facet: {
        metadata: [{ $count: 'total' }],
        data: [
          { $sort: { createdAt: -1 } },
          { $skip: startIndex },
          { $limit: limit },
          {
            $project: {
              fullName: { $ifNull: ['$fullName', '$name'] },
              phone: 1,
              details: { $ifNull: ['$details', '$message'] },
              interest: 1,
              status: 1,
              variant: 1,
              createdAt: 1,
              product: {
                _id: 1,
                name: 1,
                image: 1,
                category: 1,
                shortDescription: 1,
                variantDetails: {
                  $arrayElemAt: [
                    {
                      $filter: {
                        input: '$product.variants',
                        as: 'v',
                        cond: {
                          $or: [
                            { $eq: [{ $toString: '$$v._id' }, '$variant'] },
                            { $eq: ['$$v.sku', '$variant'] }
                          ]
                        }
                      }
                    },
                    0
                  ]
                }
              }
            }
          }
        ]
      }
    }
  ]);

  const total = results[0].metadata[0] ? results[0].metadata[0].total : 0;
  const enquiries = results[0].data;

  res.status(200).json({
    success: true,
    count: enquiries.length,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit)
    },
    data: enquiries
  });
});

// @desc    Create an enquiry
// @route   POST /api/enquiries
// @access  Public
exports.createEnquiry = asyncHandler(async (req, res, next) => {
  const enquiry = await Enquiry.create(req.body);
  res.status(201).json({
    success: true,
    data: enquiry
  });
});

// @desc    Update enquiry status
// @route   PUT /api/enquiries/:id
// @access  Private (Admin)
exports.updateEnquiryStatus = asyncHandler(async (req, res, next) => {
  const enquiry = await Enquiry.findByIdAndUpdate(
    req.params.id,
    { status: req.body.status },
    { new: true, runValidators: true }
  );

  if (!enquiry) {
    return next(new ErrorResponse(`Enquiry not found with id of ${req.params.id}`, 404));
  }

  res.status(200).json({
    success: true,
    data: enquiry
  });
});

// @desc    Delete enquiry
// @route   DELETE /api/enquiries/:id
// @access  Private (Admin)
exports.deleteEnquiry = asyncHandler(async (req, res, next) => {
  const enquiry = await Enquiry.findById(req.params.id);

  if (!enquiry) {
    return next(new ErrorResponse(`Enquiry not found with id of ${req.params.id}`, 404));
  }

  await enquiry.deleteOne();

  res.status(200).json({
    success: true,
    data: {}
  });
});
