const express = require('express');
const { getDoctors, addDoctor, updateDoctor, deleteDoctor } = require('../controllers/doctorController');
const { verifyAdmin } = require('../middlewares/authMiddleware');

const router = express.Router();

router.get('/', getDoctors);
router.post('/', addDoctor);
router.patch('/:id', updateDoctor);
router.delete('/:id', deleteDoctor);

module.exports = router;