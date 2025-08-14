const { getCachedAnalytics, invalidateAnalyticsCache } = require('../services/analytics.service');
const MediaViewLog = require('../models/MediaViewLog');
const MediaAsset = require('../models/MediaAsset');
const { getClientIP } = require('../utils/getClientIP');

const logView = async (req, res, next) => {
  try {
    const { id } = req.params;
    const clientIP = getClientIP(req);

    const media = await MediaAsset.findByPk(id);
    if (!media) {
      return res.status(404).json({ error: 'MEDIA_NOT_FOUND', message: `Media asset with ID ${id} does not exist` });
    }

    await MediaViewLog.create({
      media_id: id,
      viewed_by_ip: clientIP,
      user_agent: req.get('User-Agent'),
    });

    // Invalidate the cache for this media asset
    invalidateAnalyticsCache(id);

    res.status(201).json({ success: true, message: 'View logged successfully' });
  } catch (error) {
    next(error);
  }
};

const getAnalytics = async (req, res, next) => {
  try {
    const { id } = req.params;

    const media = await MediaAsset.findByPk(id);
    if (!media) {
      return res.status(404).json({ error: 'MEDIA_NOT_FOUND', message: `Media asset with ID ${id} does not exist` });
    }

    const analytics = await getCachedAnalytics(id);
    res.status(200).json({ media_id: id, ...analytics });
  } catch (error) {
    next(error);
  }
};

const getDashboard = async (req, res, next) => {
  try {
    const totalMedia = await MediaAsset.count();
    const totalViews = await MediaViewLog.count();
    const storageUtilization = await MediaAsset.sum('file_size');

    res.status(200).json({
      total_media: totalMedia,
      total_views: totalViews,
      storage_utilization: `${(storageUtilization / (1024 * 1024)).toFixed(2)}MB`,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  logView,
  getAnalytics,
  getDashboard,
};
