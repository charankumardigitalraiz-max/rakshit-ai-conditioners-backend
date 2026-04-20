const express = require('express');
const router = express.Router();
const { getCounts } = require('../../controller/admin/dashboard/counts');

router.get('/counts', getCounts);

module.exports = router;