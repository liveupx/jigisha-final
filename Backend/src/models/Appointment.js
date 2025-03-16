const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
    name: { type: String, required: true },
    age: { type: Number, required: true },
    gender: { type: String, required: true, enum: ['Male', 'Female', 'Other'] },
    address: { type: String, required: true },
    phone: { type: String, required: true },
    idType: { 
        type: String, 
        required: true, 
        enum: ['Aadhar', 'PAN', 'DL', 'VoterID']
    },
    idNumber: { type: String, required: true },
    issue: { type: String, required: false },
    doctorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Doctor', required: true },
    appointmentDate: { type: Date, required: true },
}, { timestamps: true });

module.exports = mongoose.model('Appointment', appointmentSchema);
   