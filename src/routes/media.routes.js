const express = require('express');
const { uploadMedia, getStreamingUrl } = require('../controllers/media.controller');
const authenticateJWT = require('../middleware/auth.middleware');
const upload = require('../middleware/upload.middleware');

const router = express.Router();

router.post('/', authenticateJWT, upload.single('media'), uploadMedia);
router.get('/:id/stream-url', authenticateJWT, getStreamingUrl);

module.exports = router;
