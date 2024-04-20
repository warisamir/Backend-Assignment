const jwt = require('jsonwebtoken');
require("dotenv").config();

const auth = (req, res, next) => {
    const token = req.headers.authorization;

    if (token) {
        jwt.verify(token.replace('Bearer ', ''), process.env.tokenpass, function(err, decoded) {
            if (err) {
                console.error("JWT Verification Error:", err);
                res.status(401).send({"msg": "Unauthorized"});
            } else {
                console.log("Decoded Token:", decoded);
                req.body.userID = decoded.userId;
                next();
            }
        });
    } else {
        res.status(401).send({"msg": "Login First"});
    }
};

module.exports = auth;
