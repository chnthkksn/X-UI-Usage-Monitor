require('dotenv').config();
const jwt = require('jsonwebtoken');

user = process.env.PANEL_USERNAME;
pword = process.env.PANEL_PASSWORD;

module.exports = async (req, res, next) => {
    const { username , password } = req.body;
    if (username && password) {
        if (username === user && password === pword) {
            const token = jwt.sign({ username: username }, process.env.JWT_SECRET, { expiresIn: '1h' });
            res.cookie('token', token, { httpOnly: true });
            res.status(200).json({ message: 'Login successful' });
        }
        else {
            res.status(401).json({ message: 'Invalid credentials' });
        }
    }
    else {
        res.status(401).json({ message: 'Invalid credentials' });
    }
}