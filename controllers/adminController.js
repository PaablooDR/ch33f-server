const Admin = require('../models/admin');

exports.getAllAdmins = async (req, res) => {
    try {
        const admins = await Admin.find({}, 'email password');
        res.json(admins);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};