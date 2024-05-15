const User = require('../models/user');
const fs = require('node:fs');
const { ObjectId } = require('mongodb');
const path = require('path');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.find({});
        res.json(users);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
exports.getUser = async(req, res) => {
    try {
        const id = req.query.id;
        const objectId = ObjectId.createFromHexString(id); // Crear un nuevo ObjectId directamente
        const user = await User.findOne({ _id: objectId });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.json(user);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Internal server error" });
    }
};

exports.getFirstUsers = async (req, res) => {
    try {
        const firstUsers = await User.find({})
            .limit(50);
        res.json(firstUsers);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.getNextUsers = async (req, res) => {
    try {
        const skip = parseInt(req.query.skip) || 0;
        const nextUsers = await User.find({})
            .skip(skip)
            .limit(25);
        res.json(nextUsers);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.getSearchedUsers = async (req, res) => {
    try {
        const search = req.query.search || "";
        const FoundUsers = await User.find({ name: { $regex: search, $options: "i" } });
        res.json(FoundUsers);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.getNextSearchedUsers = async (req, res) => {
    try {
        const skip = parseInt(req.query.skip) || 0;
        const search = req.query.search;
        const nextFoundUsers = await User.find({ name: { $regex: search, $options: "i" } })
            .skip(skip)
            .limit(25);
        res.json(nextFoundUsers);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.getFirstSearchedUsers = async (req, res) => {
    try {
        const search = req.query.search || "";
        const firstFoundUsers = await User.find({ name: { $regex: search, $options: "i" } })
            .limit(50);
        res.json(firstFoundUsers);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.createUser = async (req, res) => {
    try {
        const { name, email, password, description } = req.body;

        const hashedPassword = await bcrypt.hash(password, 10);

        newPath = saveImage(req.file);

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'El correo electrónico ya está en uso' });
        }

        if (!req.file) {
            return res.status(400).json({ message: 'Falta la imagen' });
        }

        const newUser = new User({
            name,
            email,
            password: hashedPassword,
            photo: newPath,
            description
        });

        const savedUser = await newUser.save();

        res.status(201).json(savedUser);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

function saveImage(file) {
    const ext = path.extname(file.originalname);
    const newPath = path.join(file.destination, `${file.filename}${ext}`);
    fs.renameSync(file.path, newPath);
    return newPath;
};

exports.loginUser = async(req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Usuario no encontrado' });
        }

        const isMatch = await bcrypt.compareSync(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Contraseña incorrecta' });
        }

        res.status(200).json({ 
            message: 'Login exitoso', 
            token: createToken(user)
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}

function createToken(user) {
    const payload = {
        user_id: user._id,
    }

    return jwt.sign(payload, '33 is coming home');
}