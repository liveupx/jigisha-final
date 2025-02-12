const express = require('express');
const { getDoctors, addDoctor } = require('../controllers/doctorController');
const { verifyAdmin } = require('../middlewares/authMiddleware');

const router = express.Router();

router.get('/', getDoctors);
router.post('/', verifyAdmin, addDoctor);

module.exports = router;