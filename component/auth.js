const jwt = require('jsonwebtoken')

// Generate JWT 
const genJWT = (user) => {
    const accessToken = jwt.sign({ username: user.username,name: user.name, id: user.id, role: user.role }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "5m", algorithm: "HS256" });
    return accessToken; 
};

// Validate JWT and Get User's Infomation
const validateJWT = (req, res, next) => {
    try {
        if (!req.headers["authorization"])
            return res.sendStatus(401);
        const token = req.headers["authorization"].replace("Bearer ", "");
        jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, userLog) => {
            if (err)
                throw new Error(errorMonitor);
            req.user = userLog;
            req.user.token = token;
        });
        next();
    }
    catch (err) {
        return res.sendStatus(403);
    }
};

// Export modules
module.exports = { genJWT , validateJWT };
