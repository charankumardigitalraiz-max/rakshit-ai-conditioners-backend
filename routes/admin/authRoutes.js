const express = require('express');
const {
  register,
  login,
  getMe,
  updateDetails,
  updatePassword,
} = require('../../controller/admin/authController');

const router = express.Router();

const { protect } = require('../../middleware/auth');
const upload = require('../../middleware/upload');

router.post('/register', register);
router.post('/login', login);
router.get('/me', protect, getMe);
router.put('/updatedetails', protect, upload.single('avatar'), updateDetails);
router.put('/updatepassword', protect, updatePassword);

module.exports = router;
