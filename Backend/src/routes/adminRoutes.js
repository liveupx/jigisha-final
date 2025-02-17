const express = require('express');
const { adminLogin, adminLogout } = require('../controllers/adminController');

const router = express.Router();

router.post('/login', adminLogin);
router.post('/logout', adminLogout);

module.exports = router;