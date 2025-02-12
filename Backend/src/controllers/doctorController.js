const Doctor = require('../models/Doctor');

// Get all doctors
exports.getDoctors = async (req, res) => {
    try {
        const doctors = await Doctor.find();
        const formattedDoctors = doctors.map(doc => ({
            ...doc._doc,
            availableSlots: doc.availableSlots.map(slot => slot.toISOString()) // Converts Date to string
        }));

        res.status(200).json(formattedDoctors);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

// Add a doctor (Admin)
// the frontend should send ISO date-time strings (e.g., "2025-02-15T10:00:00.000Z").
exports.addDoctor = async (req, res) => {
    try {
        const { name, specialization, availableSlots } = req.body;

        const formattedSlots = availableSlots.map(slot => new Date(slot));

        const newDoctor = new Doctor({ name, specialization, availableSlots: formattedSlots });
        await newDoctor.save();

        res.status(201).json(newDoctor);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};