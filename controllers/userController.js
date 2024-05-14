const User = require('../models/user');
const fs = require('node:fs');
const path = require('path');
const bcrypt = require('bcryptjs');

exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.find({});
        res.json(users);
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