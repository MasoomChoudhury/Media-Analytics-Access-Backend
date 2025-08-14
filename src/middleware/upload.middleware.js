const multer = require('multer');

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  // Allow text/plain for testing purposes with dummy.txt
  if (file.mimetype.startsWith('video/') || file.mimetype.startsWith('audio/') || file.mimetype === 'text/plain') {
    cb(null, true);
  } else {
    cb(new Error('Only video, audio, or text files are allowed!'), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 1024 * 1024 * 100, // 100MB
  },
});

module.exports = upload;
