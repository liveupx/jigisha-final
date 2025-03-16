const express = require('express');
const { bookAppointment, getAppointmentById, getAllAppointments, deleteAppointment } = require('../controllers/appointmentController');
// const upload = require('../middlewares/upload'); 
const { verifyAdmin } = require('../middlewares/authMiddleware'); 

const router = express.Router();

router.post('/', bookAppointment);
router.get('/:id', verifyAdmin, getAppointmentById);
router.get('/', verifyAdmin, getAllAppointments);
router.delete('/:id', verifyAdmin, deleteAppointment);

module.exports = router;
