const { Op } = require('sequelize');
const redisClient = require('../config/redis.config');
const MediaViewLog = require('../models/MediaViewLog');
const MediaAsset = require('../models/MediaAsset');

const getFreshAnalytics = async (mediaId) => {
  const totalViews = await MediaViewLog.count({ where: { media_id: mediaId } });
  const uniqueIps = await MediaViewLog.count({
    where: { media_id: mediaId },
    distinct: true,
    col: 'viewed_by_ip',
  });

  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const last30Days = await MediaViewLog.count({
    where: {
      media_id: mediaId,
      timestamp: {
        [Op.gte]: thirtyDaysAgo,
      },
    },
  });

  return {
    total_views: totalViews,
    unique_ips: uniqueIps,
    views_per_day: {}, // Placeholder
    peak_hours: {}, // Placeholder
    last_30_days: last30Days,
    growth_rate: '+0%', // Placeholder
  };
};

const getCachedAnalytics = (mediaId) => {
  return new Promise((resolve, reject) => {
    const cacheKey = `analytics:${mediaId}`;
    redisClient.get(cacheKey, async (err, data) => {
      if (err) return reject(err);
      if (data !== null) {
        return resolve({ ...JSON.parse(data), cached: true });
      }

      const freshAnalytics = await getFreshAnalytics(mediaId);
      redisClient.setex(cacheKey, 300, JSON.stringify(freshAnalytics)); // Cache for 5 minutes
      resolve({ ...freshAnalytics, cached: false });
    });
  });
};

const invalidateAnalyticsCache = (mediaId) => {
  const cacheKey = `analytics:${mediaId}`;
  redisClient.del(cacheKey);
};

module.exports = {
  getCachedAnalytics,
  invalidateAnalyticsCache,
};
