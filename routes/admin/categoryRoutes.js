const express = require('express');
const {
    getCategories,
    getCategory,
    createCategory,
    updateCategory,
    deleteCategory
} = require('../../controller/admin/categoryController');
const upload = require('../../middleware/upload');
// const { protect } = require('../../middleware/auth');
const router = express.Router();

router.route('/').get(getCategories).post(upload.single('image'), createCategory);
router.route('/:id').get(getCategory).put(upload.single('image'), updateCategory).delete(deleteCategory);

module.exports = router;