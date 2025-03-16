const express = require('express');
const { bookAppointment, getAppointmentById, getAllAppointments, deleteAppointment, getTodaysAppointments, getPastAppointments, getUpcomingAppointments } = require('../controllers/appointmentController');
const { verifyAdmin } = require('../middlewares/authMiddleware'); 

const router = express.Router();

router.post('/', bookAppointment);
router.get('/today', verifyAdmin, getTodaysAppointments);
router.get('/past', verifyAdmin, getPastAppointments);
router.get('/upcoming', verifyAdmin, getUpcomingAppointments);
router.get('/:id', verifyAdmin, getAppointmentById);
router.get('/', verifyAdmin, getAllAppointments);
router.delete('/:id', verifyAdmin, deleteAppointment);

module.exports = router;