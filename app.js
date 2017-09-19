const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const port = process.env.PORT || 3001;

// Routes
const users = require('./routes/users');

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());

app.use('/users', users);
app.use('/', (req, res) => {
    res.send('Test route working');
});

app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});
