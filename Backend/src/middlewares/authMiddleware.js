const jwt = require('jsonwebtoken');

exports.verifyAdmin = async (req, res, next) => {
    try {
        const {token} = req.cookies;
        if (!token) return res.status(401).json({ message: 'Unauthorized' });

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (decoded.role !== 'admin') return res.status(401).json({ message: 'Unauthorized' });

        req.admin = decoded;
        next();
    } catch (error) {
        res.status(401).json({ message: 'Invalid token' });
    }
};