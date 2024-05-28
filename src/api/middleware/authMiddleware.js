const jwt = require('jsonwebtoken');

const authenticate = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return res.status(401).json({ error: true, message: 'Authentication token required' });
    }

    if ( !authHeader.startsWith('Bearer ')){
        return res.status(401).json({
                error: true,
                message: "Authorization header is malformed"
            });
    }

    const token = authHeader.split(' ')[1];
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        req.isAuthenticated = true;
        next();
    } catch (error) {
        if (error instanceof jwt.TokenExpiredError) {
            return res.status(401).json({ error: true, message: "JWT token has expired" });
        } else if (error instanceof jwt.JsonWebTokenError) {
            return res.status(401).json({ error: true, message: "Invalid JWT token" });
        } else {
            return res.status(500).json({ error: true, message: "Error processing token" });
        }
    }
};

const authenticateForPublic = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (authHeader) {
        const parts = authHeader.split(' ');
        if (authHeader.startsWith('Bearer ') && parts.length === 2) {
            const token = parts[1];

            try {
                const decoded = jwt.verify(token, process.env.JWT_SECRET);
                req.user = decoded; // Add user details to request object
                req.isAuthenticated = true;
                next();
            } catch (error) {
                if (error instanceof jwt.TokenExpiredError) {
                    return res.status(401).json({
                        error: true,
                        message: "JWT token has expired"
                    });
                } else if (error instanceof jwt.JsonWebTokenError) {
                    // This captures 'jwt malformed', 'jwt signature is required', 'invalid token', etc.
                    return res.status(401).json({
                        error: true,
                        message: "Invalid JWT token"  // Generic message for all JWT verification errors
                    });
                } else {
                    // Other unexpected errors
                    return res.status(500).json({
                        error: true,
                        message: "Error processing token"
                    });
                }
            }
        } else {
            // Malformed Authorization header, not 'Bearer [token]'
            return res.status(401).json({
                error: true,
                message: "Authorization header is malformed"
            });
        }
    } else {
        // Authorization header not present or doesn't start with 'Bearer'
        req.isAuthenticated = false;
        next();
    }
};

module.exports = {
    authenticate,
    authenticateForPublic
};
