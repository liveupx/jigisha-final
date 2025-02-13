const express = require('express');
const { bookAppointment, getAppointmentById, getAllAppointments } = require('../controllers/appointmentController');
const upload = require('../middlewares/upload'); 
const { verifyAdmin } = require('../middlewares/authMiddleware'); 

const router = express.Router();

router.post('/', upload.fields([{ name: 'photo' }, { name: 'aadharPhoto' }]), bookAppointment);
router.get('/:id', getAppointmentById);
router.get('/', verifyAdmin, getAllAppointments);

module.exports = router;
