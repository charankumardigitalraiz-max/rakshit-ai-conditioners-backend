const mongoose = require('mongoose');

const testimonialSchema = new mongoose.Schema({
  image: {
    type: String,
    required: [true, 'Please add a testimonial image']
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Testimonial', testimonialSchema);
