const Admin = require('../models/Admin');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

exports.adminLogin = async (req, res) => {
    try {
        const { email, password } = req.body;
        const admin = await Admin.findOne({ email });
        if (!admin) return res.status(401).json({ message: 'Invalid credentials' });

        const isMatch = await bcrypt.compare(password, admin.password);
        if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });

        const token = await jwt.sign({ id: admin._id, role: 'admin' }, process.env.JWT_SECRET, { expiresIn: '1d' });
        res.cookie('token', token, {expires: new Date(Date.now() + 86400000)});

        res.status(200).json({ message: "Logged in successfully!" });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

exports.adminLogout = async(req, res) => {
    res.clearCookie('token');
    res.send("Logged out successfully");
}