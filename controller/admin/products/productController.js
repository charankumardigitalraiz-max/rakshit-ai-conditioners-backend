const Product = require('../../../models/products');
const asyncHandler = require('../../../middleware/asyncHandler');
const ErrorResponse = require('../../../utils/errorResponse');

// @desc    Get all products
// @route   GET /api/products
// @access  Public
exports.getProducts = asyncHandler(async (req, res, next) => {
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 10;
  const startIndex = (page - 1) * limit;

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

  const total = await Product.countDocuments(query);

  const products = await Product.find(query)
    .sort({ createdAt: -1 })
    .skip(startIndex)
    .limit(limit);

  res.status(200).json({
    success: true,
    count: products.length,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit)
    },
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

// @desc    Create new product
// @route   POST /api/products
// @access  Private (Admin)
exports.createProduct = asyncHandler(async (req, res, next) => {
  // Parse nested JSON strings from FormData if they exist
  ['variants', 'features', 'technicalSpecs', 'installation', 'warranty', 'existingImages'].forEach(field => {
    if (typeof req.body[field] === 'string') {
      try {
        req.body[field] = JSON.parse(req.body[field]);
      } catch (err) {
        // Skip if not valid JSON
      }
    }
  });

  console.log('--- Create Product Debug ---');
  console.log('Body:', req.body);
  console.log('Files:', req.files);

  let galleryPaths = Array.isArray(req.body.existingImages) ? req.body.existingImages : [];

  if (req.files && Array.isArray(req.files)) {
    req.files.forEach(file => {
      if (file.fieldname === 'imageFile') {
        req.body.image = `/uploads/${file.filename}`;
      } else if (file.fieldname === 'imageGallery') {
        galleryPaths.push(`/uploads/${file.filename}`);
      }
    });
  }
  
  req.body.images = galleryPaths;
  
  if (req.body.name) {
    const baseSlug = req.body.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    req.body.slug = `${baseSlug}-${Math.floor(1000 + Math.random() * 9000)}`;
  }

  const product = await Product.create(req.body);
  res.status(201).json({
    success: true,
    data: product
  });
});

// @desc    Update product
// @route   PUT /api/products/:id
// @access  Private (Admin)
exports.updateProduct = asyncHandler(async (req, res, next) => {
  let product = await Product.findById(req.params.id);

  if (!product) {
    return next(new ErrorResponse(`Product not found with id of ${req.params.id}`, 404));
  }

  // Parse nested JSON strings from FormData if they exist
  ['variants', 'features', 'technicalSpecs', 'installation', 'warranty', 'existingImages'].forEach(field => {
    if (typeof req.body[field] === 'string') {
      try {
        req.body[field] = JSON.parse(req.body[field]);
      } catch (err) {
        // Skip if not valid JSON
      }
    }
  });

  console.log('--- Update Product Debug ---');
  console.log('Body:', req.body);
  console.log('Files:', req.files);

  let galleryPaths = Array.isArray(req.body.existingImages) ? req.body.existingImages : product.images || [];

  if (req.files && Array.isArray(req.files)) {
    const newGalleryPaths = [];
    req.files.forEach(file => {
      if (file.fieldname === 'imageFile') {
        req.body.image = `/uploads/${file.filename}`;
      } else if (file.fieldname === 'imageGallery') {
        newGalleryPaths.push(`/uploads/${file.filename}`);
      }
    });

    if (newGalleryPaths.length > 0) {
      const baseGallery = Array.isArray(req.body.existingImages) ? req.body.existingImages : (product.images || []);
      galleryPaths = [...baseGallery, ...newGalleryPaths];
    }
  }

  // Update images field only if metadata was provided or new files were uploaded
  const hasNewFiles = req.files && req.files.some(f => f.fieldname === 'imageGallery');
  if (req.body.existingImages || hasNewFiles) {
    req.body.images = galleryPaths;
  }

  if (req.body.name && !product.slug) {
    const baseSlug = req.body.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    req.body.slug = `${baseSlug}-${Math.floor(1000 + Math.random() * 9000)}`;
  }

  product = await Product.findByIdAndUpdate(req.params.id, req.body, {
    returnDocument: 'after',
    runValidators: true
  });

  res.status(200).json({
    success: true,
    data: product
  });
});

// @desc    Delete product
// @route   DELETE /api/products/:id
// @access  Private (Admin)
exports.deleteProduct = asyncHandler(async (req, res, next) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    return next(new ErrorResponse(`Product not found with id of ${req.params.id}`, 404));
  }

  await product.deleteOne();

  res.status(200).json({
    success: true,
    data: {}
  });
});
