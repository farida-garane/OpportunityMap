
const jwt = require('jsonwebtoken');

async function authMiddleware(req, res, next) {
    // 1. Look for the token in the request header
    const authHeader = req.headers.authorization; // expected format: "Bearer <token>"

    if (!authHeader) {
        return res.status(401).json({ message: 'No token provided. Access denied.' });
    }

    const token = authHeader.split(' ')[1]; 

    if (!token) {
        return res.status(401).json({ message: 'Malformed token. Access denied.' });
    }

    try {
        // 2. Verify the token (checks the pass — does NOT create one)
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // 3. Attach the user info to the request, so controllers can use req.user.id
        req.user = decoded;

        // 4. Let the request continue to the controller
        next();
    } catch (error) {
        return res.status(401).json({ message: 'Invalid or expired token.' });
    }
}

module.exports = authMiddleware;