const Recipe = require('../models/recipe');
const User = require('../models/user');
const fs = require('node:fs');
const { ObjectId } = require('mongodb');
const path = require('path');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.getAllRecipes = async (req, res) => {
    try {
        const recipes = await Recipe.find({});
        res.json(recipes);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
exports.getUserRecipes = async (req, res) => {
    try {
        const id = req.query.id;
        const objectId = ObjectId.createFromHexString(id);
        const recipes = await Recipe.find({ user: objectId });
        res.json(recipes);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
exports.getSearchedRecipes = async (req, res) => {
    try {
        const search = req.query.search || "";
        const FoundRecipes = await Recipe.find({ title: { $regex: search, $options: "i" } });
        res.json(FoundRecipes);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
exports.getRecipe = async(req, res) => {
    try {
        const id = req.query.id;
        const objectId = ObjectId.createFromHexString(id); // Crear un nuevo ObjectId directamente
        const recipe = await Recipe.findOne({ _id: objectId });
        if (!recipe) {
            return res.status(404).json({ message: "Recipe not found" });
        }
        res.json(recipe);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Internal server error" });
    }
};
exports.getTopRecipes = async (req, res) => {
    try {
        const topRecipes = await Recipe.find({})
            .sort({ visits: -1 })
            .limit(5);
        res.json(topRecipes);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
exports.getFirstRecipes = async (req, res) => {
    try {
        const firstRecipes = await Recipe.find({})
            .limit(10);
        res.json(firstRecipes);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
exports.getFirstSearchedRecipes = async (req, res) => {
    try {
        const search = req.query.search || "";
        const firstFoundRecipes = await Recipe.find({ title: { $regex: search, $options: "i" } })
            .limit(50);
        res.json(firstFoundRecipes);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
exports.getNextRecipes = async (req, res) => {
    try {
        const skip = parseInt(req.query.skip) || 0;
        const nextRecipes = await Recipe.find({})
            .skip(skip)
            .limit(5);
        res.json(nextRecipes);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
exports.getNextSearchedRecipes = async (req, res) => {
    try {
        const skip = parseInt(req.query.skip) || 0;
        const search = req.query.search;
        const nextFoundRecipes = await Recipe.find({ title: { $regex: search, $options: "i" } })
            .skip(skip)
            .limit(5);
        res.json(nextFoundRecipes);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
exports.sumVisitToRecipe = async(req, res) => {
    try {
        const id = req.query.id;
        const objectId = ObjectId.createFromHexString(id); // Crear un nuevo ObjectId directamente
        const recipe = await Recipe.findOneAndUpdate(
            { _id: objectId },
            { $inc: { visits: 1 } },
            { new: true }
        );
        if (!recipe) {
            return res.status(404).json({ message: "Recipe not found" });
        }
        res.json(recipe);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Internal server error" });
    }
};
exports.getSavedRecipes = async(req,res) => {
    try {
        const id = req.query.id;
        const objectId = ObjectId.createFromHexString(id);
        const user = await User.findOne({ _id: objectId });
        if (!user) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }
        // console.log(user.saved)
        const recipes = await Recipe.find({ _id: { $in: user.saved } });
        res.json(recipes);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Internal server error" });
    }
}

exports.createRecipe = async(req,res) => {
    try {
        const formData = req.body;

        // console.log(formData);

        newPath = saveImage(req.file);

        const ingredients = [];
        for (let i = 0; i < parseInt(formData.ingredientNumber); i++) {
            ingredients.push(formData[`ingredient${i}`]);
        }

        const instructions = [];
        for (let i = 0; i < parseInt(formData.stepNumber); i++) {
            instructions.push({
                title: formData[`steptitle${i}`],
                description: formData[`stepdescription${i}`]
            });
        }

        const objectIdUser = ObjectId.createFromHexString(formData.user);

        const newRecipe = new Recipe({
            title: formData.title,
            user: objectIdUser,
            description: formData.description,
            main_photo: newPath,
            ingredients: ingredients,
            instructions: instructions
        });
        const savedRecipe = await newRecipe.save();
        res.status(201).json(savedRecipe);

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Internal server error" });
    }
}

function saveImage(file) {
    const ext = path.extname(file.originalname);
    const newPath = path.join(file.destination, `${file.filename}${ext}`);
    fs.renameSync(file.path, newPath);
    return newPath;
};