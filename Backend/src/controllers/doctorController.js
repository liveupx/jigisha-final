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
        const { name, specialization, availableSlots, district } = req.body;

        const formattedSlots = availableSlots.map(slot => new Date(slot));

        const newDoctor = new Doctor({ name, specialization, availableSlots: formattedSlots, district });
        await newDoctor.save();

        res.status(201).json(newDoctor);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

// Update a doctor
exports.updateDoctor = async (req, res) => {
    try {
        const { name, specialization, availableSlots, district } = req.body;
        const { id } = req.params;

        const formattedSlots = availableSlots?.map(slot => new Date(slot));

        const updatedDoctor = await Doctor.findByIdAndUpdate(
            id,
            { name, specialization, availableSlots: formattedSlots, district },
            { new: true, runValidators: true }
        );

        if (!updatedDoctor) {
            return res.status(404).json({ message: 'Doctor not found' });
        }

        res.status(200).json(updatedDoctor);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

// Delete a doctor
exports.deleteDoctor = async (req, res) => {
    try {
        const { id } = req.params;

        const deletedDoctor = await Doctor.findByIdAndDelete(id);

        if (!deletedDoctor) {
            return res.status(404).json({ message: 'Doctor not found' });
        }

        res.status(200).json({ message: 'Doctor deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};