const Contact = require('../../../models/Contact');
const asyncHandler = require('../../../middleware/asyncHandler');

// @desc    Create a contact message
// @route   POST /api/contacts
// @access  Public
exports.createContact = asyncHandler(async (req, res, next) => {
  const contact = await Contact.create(req.body);
  res.status(201).json({
    success: true,
    data: contact
  });
});
