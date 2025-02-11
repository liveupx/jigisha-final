const express = require('express');
const connectDB = require('./config/database');
require('dotenv').config();

const app = express();

connectDB()
    .then(() => {
        console.log('Database connected');
        app.listen(3000, () => {
            console.log('Server is running on port 3000');
        });
    })
    .catch((err) => {
        console.log(err);
    });