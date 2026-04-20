const express = require('express');
const {
  getAchievements,
  getAchievement,
  createAchievement,
  updateAchievement,
  deleteAchievement
} = require('../../controller/admin/achievements/achievementController');

const upload = require('../../middleware/upload');

const router = express.Router();

router
  .route('/')
  .get(getAchievements)
  .post(upload.single('image'), createAchievement);

router
  .route('/:id')
  .get(getAchievement)
  .put(upload.single('image'), updateAchievement)
  .delete(deleteAchievement);

module.exports = router;
