const crypto = require('crypto');

const generateSecureStreamURL = (mediaId, expiryMinutes = 10) => {
  const expiryTime = Math.floor(Date.now() / 1000) + expiryMinutes * 60;
  const payload = `${mediaId}:${expiryTime}`;

  const signature = crypto
    .createHmac('sha256', process.env.URL_SIGNING_SECRET)
    .update(payload)
    .digest('hex');

  const baseURL = process.env.BASE_URL || 'http://localhost:3000';
  return {
    url: `${baseURL}/stream/${mediaId}?expires=${expiryTime}&signature=${signature}`,
    expires_at: new Date(expiryTime * 1000).toISOString(),
    expires_in: expiryMinutes * 60,
  };
};

const verifyStreamURL = (mediaId, expires, signature) => {
  const currentTime = Math.floor(Date.now() / 1000);

  if (currentTime > expires) {
    throw new Error('URL_EXPIRED');
  }

  const payload = `${mediaId}:${expires}`;
  const expectedSignature = crypto
    .createHmac('sha256', process.env.URL_SIGNING_SECRET)
    .update(payload)
    .digest('hex');

  if (signature !== expectedSignature) {
    throw new Error('INVALID_SIGNATURE');
  }

  return true;
};

module.exports = {
  generateSecureStreamURL,
  verifyStreamURL,
};
