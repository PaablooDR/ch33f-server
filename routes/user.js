const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const multer = require('multer');

const upload = multer({ dest: 'uploads/' });

router.get('/users', userController.getAllUsers);
router.get('/users/user', userController.getUser);
router.get('/users/first', userController.getFirstUsers);
router.get('/users/nextUsers', userController.getNextUsers);
router.get('/users/firstsearch', userController.getFirstSearchedUsers); 
router.get('/users/nextUserSearch', userController.getNextSearchedUsers);
router.get('/users/find', userController.getSearchedUsers);7

router.post('/users', upload.single('photo'), userController.createUser);

router.post('/users/login', userController.loginUser);

module.exports = router;