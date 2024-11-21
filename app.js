require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const routes = require('./routes/index');
const fileQueue = require('./queue');
const sequelize = require('./models/db.js'); // Database connection

const app = express();
app.use(bodyParser.json());

// Routes
app.use('/', routes);

// Process Redis Queue
fileQueue.process((job, done) => {
    console.log(`Processing job: ${job.id}`);
    setTimeout(() => done(), 3000);
});

// Sync database and start server
sequelize.sync({ force: false }).then(() => {
    app.listen(3000, () => console.log('Server running on http://localhost:3000'));
});
