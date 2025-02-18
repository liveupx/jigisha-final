const express = require('express');
const { adminLogin, adminLogout, getAuthStatus } = require('../controllers/adminController');

const router = express.Router();

router.post('/login', adminLogin);
router.post('/logout', adminLogout);

module.exports = router;