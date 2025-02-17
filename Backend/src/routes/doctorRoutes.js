const express = require('express');
const { getDoctors, addDoctor, updateDoctor, deleteDoctor } = require('../controllers/doctorController');
const { verifyAdmin } = require('../middlewares/authMiddleware');

const router = express.Router();

router.get('/', getDoctors);
router.post('/', verifyAdmin, addDoctor);
router.patch('/:id', verifyAdmin, updateDoctor);
router.delete('/:id', verifyAdmin, deleteDoctor);

module.exports = router;