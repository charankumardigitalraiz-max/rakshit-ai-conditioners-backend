const express = require('express');
const {
  getClients,
    getClient
} = require('../../controller/website/clients/clients');

// const upload = require('../../middleware/upload');

const router = express.Router();

router
  .route('/')
  .get(getClients)
// .post(upload.single('image'), createAchievement);

router
  .route('/:id')
  .get(getClient)
//   .put(upload.single('image'), updateAchievement)
//   .delete(deleteAchievement);

module.exports = router;
