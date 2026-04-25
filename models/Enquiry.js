const mongoose = require('mongoose');

const enquirySchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: [true, 'Please add a name'],
    trim: true
  },
  phone: {
    type: String,
    required: [true, 'Please add a phone number']
  },
  email: {
    type: String,
    reqired: false
    // required: [true, 'Please add an email']
  },
  interest: {
    type: String,
    required: [true, 'Please select an interest']
  },
  details: {
    type: String,
    trim: true
  },
  product: {
    type: String, // Can be ObjectId string or Slug
    default: null
  },
  variant: {
    type: String, // Can be ID or SKU
    default: null
  },
  status: {
    type: String,
    enum: ['New', 'Contacted', 'Resolved', 'Replied', 'Closed'],
    default: 'New'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Enquiry', enquirySchema);
