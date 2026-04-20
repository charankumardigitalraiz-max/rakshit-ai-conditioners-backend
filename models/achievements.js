const mongoose = require("mongoose");

const achievementSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please add a title'],
    trim: true
  },
  year: {
    type: String,
    required: [true, 'Please add a year']
  },
  description: String,
  status: {
    type: String,
    default: 'Active'
  },
  image: String
}, {
  timestamps: true
});

module.exports = mongoose.model("Achievement", achievementSchema);