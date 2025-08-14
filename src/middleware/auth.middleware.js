const jwt = require('jsonwebtoken');

const authenticateJWT = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (authHeader) {
    const token = authHeader.split(' ')[1];

    if (token) {
      try {
        const user = jwt.verify(token, process.env.JWT_SECRET);
        req.user = user;
        next();
      } catch (err) {
        return res.sendStatus(403);
      }
    } else {
      res.sendStatus(401);
    }
  } else {
    res.sendStatus(401);
  }
};

module.exports = authenticateJWT;
