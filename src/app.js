const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const authRoutes = require('./routes/auth.routes');
const mediaRoutes = require('./routes/media.routes');
const analyticsRoutes = require('./routes/analytics.routes');
const errorMiddleware = require('./middleware/error.middleware');
const { apiLimiter } = require('./middleware/rateLimiter.middleware');

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(apiLimiter);

app.use('/auth', authRoutes);
const fs = require('fs');
const path = require('path');
const { verifyStreamURL } = require('./services/streaming.service');
const MediaAsset = require('./models/MediaAsset');
const MediaViewLog = require('./models/MediaViewLog');
const { invalidateAnalyticsCache } = require('./services/analytics.service');

app.use('/media', mediaRoutes);
app.use('/analytics', analyticsRoutes);

app.get('/stream/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const { expires, signature } = req.query;

    if (!expires || !signature) {
      return res.status(400).json({ error: 'MISSING_PARAMETERS' });
    }

    verifyStreamURL(id, parseInt(expires), signature);

    const media = await MediaAsset.findByPk(id);
    if (!media) {
      return res.status(404).json({ error: 'MEDIA_NOT_FOUND' });
    }

    // Invalidate analytics cache and log the view
    invalidateAnalyticsCache(id);
    await MediaViewLog.create({
      media_id: id,
      viewed_by_ip: req.ip,
      user_agent: req.get('User-Agent'),
    });

    const filePath = path.join(__dirname, '..', media.file_url);
    res.setHeader('Content-Type', media.mime_type);
    const stream = fs.createReadStream(filePath);
    stream.pipe(res);
  } catch (error) {
    if (error.message === 'URL_EXPIRED') {
      return res.status(410).json({ error: 'URL_EXPIRED' });
    }
    if (error.message === 'INVALID_SIGNATURE') {
      return res.status(403).json({ error: 'INVALID_SIGNATURE' });
    }
    next(error);
  }
});

app.use(errorMiddleware);

const { connectDB } = require('./config/database');

const PORT = process.env.PORT || 3000;

const startServer = async () => {
  await connectDB();
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
};

startServer();

module.exports = app;
