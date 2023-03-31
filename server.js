const express = require('express');
const updater  = require('./updater')
const scanner = require('./scanner');

// updater.getDbs();
// setInterval(() => {
//     updater.getDbs();
// }, 600000);

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/index.html');
});

app.get('/admin', (req, res) => {
    res.sendFile(__dirname + '/public/admin.html');
});

app.get('/api', (req, res) => {
    res.send('API is working properly');
});

app.get('/api/getDbs', (req, res) => {
    updater.getDbs();
    res.send('Dbs updated, check console for more info');
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

app.listen(3000, () => {
    console.log('Server started on port 3000');
});