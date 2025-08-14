const MediaAsset = require('../models/MediaAsset');
const { getClientIP } = require('../utils/getClientIP'); // Assuming you have this utility

const uploadMedia = async (req, res, next) => {
  try {
    const { title, type } = req.body;
    const file = req.file;

    if (!title || !type || !file) {
      return res.status(400).json({ error: 'Title, type, and media file are required' });
    }

    // In a real application, you would upload the file to a cloud storage
    // and get a URL. For now, we'll use a placeholder.
    const fileUrl = `uploads/${file.originalname}`;

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

const getStreamingUrl = async (req, res, next) => {
  try {
    // This is a placeholder. In a real application, you would generate a
    // signed URL with a short expiry time.
    const mediaAsset = await MediaAsset.findByPk(req.params.id);
    if (!mediaAsset) {
      return res.status(404).json({ error: 'Media not found' });
    }
    res.status(200).json({ url: mediaAsset.file_url });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  uploadMedia,
  getStreamingUrl,
};
