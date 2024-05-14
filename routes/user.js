const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const multer = require('multer');

const upload = multer({ dest: 'uploads/' });

router.get('/users', userController.getAllUsers);

router.post('/users', upload.single('photo'), userController.createUser);

module.exports = router;