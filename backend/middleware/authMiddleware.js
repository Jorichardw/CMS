const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
    // Get token from header
    const authHeader = req.headers['authorization'];
    const token = authHeader?.split(' ')[1]; // Format: Bearer <token>

    if (!token) {
        return res.status(401).json({ message: 'Access denied. No token provided.' });
    }

    try {
        const secret = process.env.JWT_SECRET || 'your_super_secret_key_here';
        const decoded = jwt.verify(token, secret);
        req.user = decoded; // Attach user payload to request
        next();
    } catch (err) {
        console.error('JWT verification error:', err);
        return res.status(403).json({ message: 'Invalid or expired token.' });
    }
};

module.exports = authMiddleware;
