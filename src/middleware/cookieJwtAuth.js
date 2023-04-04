const jwt = require('jsonwebtoken');
require('dotenv').config();

user = process.env.PANEL_USERNAME;

const cookieJwtAuth = (req, res, next) => {
    const token = req.cookies.token;
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (decoded.username === user) {
            next();
        }
        else {
            res.status(401).json({ message: 'Invalid credentials, Login again !' });
        }
    }
    catch (err) {
        res.status(401).json({ message: 'Invalid credentials, Login again !' });
    }
}

module.exports = { cookieJwtAuth };