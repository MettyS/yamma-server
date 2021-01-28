const config = require('../config');

// middleware
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const AuthService = {
  // get user with username
  getUserWithUsername(db, username) {
    return db('users').where({ username }).first();
  },
  // compare password to hashedPassword
  comparePasswords(password, hash) {
    return bcrypt.compare(password, hash);
  },
  // create a jwt token (auth token)
  createJwt(subject, payload) {
    return jwt.sign(payload, config.JWT_SECRET, {
      subject,
      expiresIn: config.JWT_EXPIRY,
      algorithm: 'HS256',
    });
  },
  // check that token is a jwt token
  verifyJwt(token) {
    return jwt.verify(token, config.JWT_SECRET, {
      algorithms: ['HS256'],
    });
  },
};

module.exports = AuthService;
