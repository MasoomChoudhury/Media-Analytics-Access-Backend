const express = require('express');
const { logView, getAnalytics, getDashboard } = require('../controllers/analytics.controller');
const authenticateJWT = require('../middleware/auth.middleware');

const router = express.Router();

router.post('/media/:id/view', authenticateJWT, logView);
router.get('/media/:id/analytics', authenticateJWT, getAnalytics);
router.get('/dashboard', authenticateJWT, getDashboard);

module.exports = router;
