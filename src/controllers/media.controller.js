const MediaAsset = require('../models/MediaAsset');
const { getClientIP } = require('../utils/getClientIP'); // Assuming you have this utility

const uploadMedia = async (req, res, next) => {
  try {
    const { title, type } = req.body;
    const file = req.file;

    if (!title || !type || !file) {
      return res.status(400).json({ error: 'Title, type, and media file are required' });
    }

    const fs = require('fs');
    const path = require('path');

    // In a real application, you would upload the file to a cloud storage
    // and get a URL. For now, we'll save it locally.
    const fileUrl = `uploads/${Date.now()}-${file.originalname}`;
    const filePath = path.join(__dirname, '..', '..', fileUrl);
    fs.writeFileSync(filePath, file.buffer);

    const mediaAsset = await MediaAsset.create({
      title,
      type,
      file_url: fileUrl,
      file_size: file.size,
      mime_type: file.mimetype,
      uploaded_by: req.user.id,
    });

    res.status(201).json(mediaAsset);
  } catch (error) {
    next(error);
  }
};

const { generateSecureStreamURL } = require('../services/streaming.service');

const getStreamingUrl = async (req, res, next) => {
  try {
    const mediaAsset = await MediaAsset.findByPk(req.params.id);
    if (!mediaAsset) {
      return res.status(404).json({ error: 'Media not found' });
    }
    const secureUrl = generateSecureStreamURL(mediaAsset.id);
    res.status(200).json(secureUrl);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  uploadMedia,
  getStreamingUrl,
};
