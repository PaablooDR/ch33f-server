const express = require('express');
const router = express.Router();
const recipeController = require('../controllers/recipeController');
const multer = require('multer');
const { checkToken } = require('../utils/middleware');
const upload = multer({ dest: 'uploads/' });

router.get('/recipes', recipeController.getAllRecipes);
router.get('/recipes/user', recipeController.getUserRecipes)
router.get('/recipes/recipe', recipeController.getRecipe);
router.get('/recipes/find', recipeController.getSearchedRecipes);
router.get('/recipes/top5', recipeController.getTopRecipes);
router.get('/recipes/first', recipeController.getFirstRecipes);
router.get('/recipes/nextRecipes', recipeController.getNextRecipes);
router.get('/recipes/firstsearch', recipeController.getFirstSearchedRecipes);
router.get('/recipes/nextRecipeSearch', recipeController.getNextSearchedRecipes);
router.post('/recipes', upload.single('photo'), recipeController.createRecipe);
router.get('/recipes/visits', recipeController.sumVisitToRecipe);

module.exports = router;