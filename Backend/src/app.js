const express = require('express');
const connectDB = require('./config/database');
require('dotenv').config();
const cors = require('cors');
const doctorRoutes = require('./routes/doctorRoutes');
const adminRoutes = require('./routes/adminRoutes');
const appointmentRoutes = require('./routes/appointmentRoutes');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/admin', adminRoutes);
app.use('/api/doctors', doctorRoutes);
app.use('/api/appointments', appointmentRoutes);


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