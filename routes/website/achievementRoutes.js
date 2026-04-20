const express = require('express');
const {
  getAchievements,

} = require('../../controller/website/achievements/achievementController');

// const upload = require('../../middleware/upload');

const router = express.Router();

router
  .route('/')
  .get(getAchievements)
// .post(upload.single('image'), createAchievement);

// router
//   .route('/:id')
//   .get(getAchievement)
//   .put(upload.single('image'), updateAchievement)
//   .delete(deleteAchievement);

module.exports = router;
