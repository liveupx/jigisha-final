const Appointment = require('../models/Appointment');
const Doctor = require('../models/Doctor');
const fs = require('fs');
const path = require('path');

// Book an appointment
exports.bookAppointment = async (req, res) => {
    try {
        
        const { name, age, gender, address, phone, idType, idNumber, issue, doctorId, appointmentDate } = req.body;
        
        const requestedSlot = new Date(appointmentDate);
        const doctor = await Doctor.findById(doctorId);

        if (!doctor) {
            return res.status(404).json({ message: 'Doctor not found' });
        }

        const slotIndex = doctor.availableSlots.findIndex(slot => slot.getTime() === requestedSlot.getTime());

        if (slotIndex === -1) {
            return res.status(400).json({ message: 'Selected time slot is not available' });
        }
  
        const newAppointment = new Appointment({
            name,
            age,
            gender,
            address,
            phone,
            idType,
            idNumber,
            issue,
            doctorId,
            appointmentDate: requestedSlot
        });

        await newAppointment.save();
        doctor.availableSlots.splice(slotIndex, 1);

        await doctor.save();

        res.status(201).json({ message: 'Appointment booked successfully', appointment: newAppointment });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

// Get appointment by ID
exports.getAppointmentById = async (req, res) => {
    try {
        const appointment = await Appointment.findById(req.params.id).populate('doctorId');
        if (!appointment) {
            return res.status(404).json({ message: 'Appointment not found' });
        }

        res.status(200).json(appointment);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

// Get all appointments (Admin only)
exports.getAllAppointments = async (req, res) => {
    try {
        const appointments = await Appointment.find().populate('doctorId');
        
        res.status(200).json(appointments);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

exports.deleteAppointment = async (req, res) => {
    try {
        const { id } = req.params;

        const deletedAppointment = await Appointment.findByIdAndDelete(id);

        if (!deletedAppointment) {
            return res.status(404).json({ message: 'Appointment not found' });
        }

        res.status(200).json({ message: 'Appointment deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};