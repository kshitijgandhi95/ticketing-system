const express = require('express');
const mongoose = require('mongoose');
const app = express();
const ticketRoutes = require('./routes/routes');
const bodyParser = require('body-parser')

app.use(bodyParser.json());

app.use('/', ticketRoutes);

app.listen(3000);


mongoose.connect('mongodb://localhost/ticketSys',
    {
        useNewUrlParser: true,
        useUnifiedTopology: true
    },
    (err) => {
        if (err) {
            console.log(`Error while connecting to mongoDb  ${err}`);
        }
        console.log("Connected to MongoDb ")
    })