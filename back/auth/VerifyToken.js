const jwt = require('jsonwebtoken');
const config = require('../config/config');
const User = require('../models/User');

const verifyToken = (req, res, next) => {
  const token = req.headers.authorization;
  if (!token) {
    return res.status(403).send({
      auth: false,
      message: 'No token provided.',
    });
  }
  jwt.verify(token, config.secret, async (err, decoded) => {
    try {
      if (err) {
        return res.status(401)
          .send({
            auth: false,
            login: {
              detail: 'You have been disconnected, please logIn',
            },
          });
      }
      const user = await User.findOne(
        { _id: decoded.user._id },
        {
          typeUser: 1,
          fullName: 1,
          picture: 1,
          available: 1,
          rooms: 1,
        },
      );
      res.locals.user = user;
    } catch (error) {
      return next(error);
    }
  });
  next();
};

module.exports = verifyToken;
