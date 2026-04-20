const express = require('express');
const {
  getProjects,
  getProject,
  // createProject,
  // updateProject,
  // deleteProject
} = require('../../controller/website/projects/projectController');

// const upload = require('../../middleware/upload');
// const { protect } = require('../../middleware/auth');

const router = express.Router();

router
  .route('/')
  .get(getProjects)
// .post(protect, upload.single('image'), createProject);

router
  .route('/:id')
  .get(getProject)
//   .put(protect, upload.single('image'), updateProject)
//   .delete(protect, deleteProject);

module.exports = router;
