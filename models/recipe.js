const mongoose = require('mongoose');

const recipeSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  main_photo: {
    type: String
  },
  ingredients: [{
    type: String,
    required: true
  }],
  instructions: [{
    title: {
      type: String,
      required: true
    },
    image: {
      type: String
    },
    description: {
      type: String,
      required: true
    }
  }],
  visits: {
    type: Number,
    default: 0
  }
});

const Recipe = mongoose.model('Recipe', recipeSchema);

module.exports = Recipe;
