require('dotenv').config();

const PORT = process.env.PANEL_PORT || 3000;
const loginRoute = require('./src/routes/login');
const express = require('express');
const updater  = require('./updater')
const scanner = require('./scanner');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const { cookieJwtAuth } = require('./src/middleware/cookieJwtAuth');

updater.getDbs();
setInterval(() => {
    updater.getDbs();
}, 600000);

const app = express();

app.use(cors());
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

app.get('/api', (req, res) => {
    res.send('API is working properly');
});
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/index.html');
});

app.get('/login', (req, res) => {
    res.sendFile(__dirname + '/public/login.html');
});

app.get('/api/logout', (req, res) => {
    if (req.cookies.token) {
        res.clearCookie('token');
    }   
    else{
        res.status(404).json({ message: 'No token found' });
    }
    res.status(200).json({ status: 'success' });
});

app.post('/api/verifyLogin', loginRoute);

app.get('/admin', (req, res) => {
    cookieJwtAuth(req, res, () => {
        res.sendFile(__dirname + '/public/admin.html');
    });
});

app.get('/api/getDbs', (req, res) => {
    updater.getDbs();
    res.send('Dbs updated, check console for more info');
});

app.get('/api/getTable', async (req, res) => {
    const data = await scanner.fetchAll();
    if (data.length > 0) {
        res.status(200).json(data);
    }
    else {
        res.status(404).json({ message: 'No data found' });
    }
});

app.get('/api/usage/:email', async (req, res) => {
    const email = req.params.email;
    const usage = await scanner.fetchInfo(email);
    if (usage.length > 0) {
        res.status(200).json(usage);
    }
    else {
        res.status(404).json({ message: 'No data found' });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});