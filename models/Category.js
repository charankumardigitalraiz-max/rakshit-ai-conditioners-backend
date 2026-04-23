const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Category name is required']
    },
    // slug: {
    //     type: String,
    //     required: true
    // },
    // image: {
    //     type: String,
    //     required: true
    // },
    description: {
        type: String,
        required: false
    },
    status: {
        type: String,
        enum: ['active', 'inactive'],
        default: 'active'
    }
}, { timestamps: true });

module.exports = mongoose.model('Category', categorySchema);