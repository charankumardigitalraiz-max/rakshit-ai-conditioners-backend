const mongoose = require('mongoose');

const clientSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a client name'],
    trim: true
  },
  hp: {
    type: String,
    trim: true
  },
  location: {
    type: String,
    trim: true
  },
  image: {
    type: String,
    required: [true, 'Please add an image']
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Client', clientSchema);
