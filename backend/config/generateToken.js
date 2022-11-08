const jwt = require("jsonwebtoken");

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { // sign a new token with that particular id
        expiresIn: "30d",
    });
}


module.exports = generateToken;