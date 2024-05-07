const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');

router.get('/admins', adminController.getAllAdmins);

module.exports = router;