const express = require('express');
const { createContact } = require('../../controller/website/messages/contactController');

const router = express.Router();

router.route('/').post(createContact);

module.exports = router;
