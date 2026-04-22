const express = require('express');
const {
  getClients,
  getClient,
  createClient,
  updateClient,
  deleteClient
} = require('../../controller/admin/clientController');

const upload = require('../../middleware/upload');
const { protect } = require('../../middleware/auth');

const router = express.Router();

router
  .route('/')
  .get(getClients)
  .post(protect, upload.single('image'), createClient);

router
  .route('/:id')
  .get(getClient)
  .put(protect, upload.single('image'), updateClient)
  .delete(protect, deleteClient);

module.exports = router;
