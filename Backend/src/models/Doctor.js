const mongoose = require('mongoose');

const doctorSchema = new mongoose.Schema({
    name: { type: String, required: true },
    specialization: { type: String, required: true },
    availableSlots: [{ type: Date }],
    district: { type: String, required: true },
});

module.exports = mongoose.model('Doctor', doctorSchema);