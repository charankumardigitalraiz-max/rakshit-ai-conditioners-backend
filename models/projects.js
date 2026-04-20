const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please add a project title'],
    trim: true
  },
  category: {
    type: String,
    required: [true, 'Please select a category']
  },
  location: String,
  date: String, // Timeline
  status: {
    type: String,
    enum: ['Planning', 'In Progress', 'Completed'],
    default: 'Planning'
  },
  hvacSystemType: String,
  totalCapacity: String,
  description: String,
  image: String
}, {
  timestamps: true
});

module.exports = mongoose.model("Project", projectSchema);