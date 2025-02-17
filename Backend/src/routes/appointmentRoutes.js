const express = require('express');
const { bookAppointment, getAppointmentById, getAllAppointments, deleteAppointment } = require('../controllers/appointmentController');
const upload = require('../middlewares/upload'); 
const { verifyAdmin } = require('../middlewares/authMiddleware'); 

const router = express.Router();

router.post('/', upload.fields([{ name: 'photo' }, { name: 'aadharPhoto' }]), bookAppointment);
router.get('/:id', getAppointmentById);
router.get('/', getAllAppointments);
router.delete('/:id', deleteAppointment);

module.exports = router;
