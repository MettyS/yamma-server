const express = require('express');

// middleware
const { requireAuth } = require('../middleware/jwt-auth');
const jsonBodyParser = express.json();

// Auth Service file
const AuthService = require('./auth-service');

// initialize authRouter
const authRouter = express.Router();

/* define authRouter */
// ROUTE /auth/login
authRouter
  .route('/login')
  .post(jsonBodyParser, async (req, res, next) => {
    const { username, password } = req.body;
    const loginUser = { username, password };

    // expect all keys to have values
    for (const [key, value] of Object.entries(loginUser))
      if (value == null)
        return res.status(400).json({
          error: `Missing '${key}' in request body`,
        });

    // begin try block
    try {
      // get the user with username
      const dbUser = await AuthService.getUserWithUsername(
        req.app.get('db'),
        loginUser.username
      );

      // if user doesn't exist, send generic message
      if (!dbUser)
        return res.status(400).json({
          error: 'Incorrect username or password',
        });

      // see if the passwords match
      const compareMatch = await AuthService.comparePasswords(
        loginUser.password,
        dbUser.password
      );

      // if the passwords don't match, send generic message
      if (!compareMatch)
        return res.status(400).json({
          error: 'Incorrect username or password',
        });

      const sub = dbUser.username;
      const payload = {
        user_id: dbUser.id,
      };
      // create and send authtoken
      res.status(201).json({
        authToken: AuthService.createJwt(sub, payload),
      });
    } catch (error) {
      next(error);
    }
  })

  .put(requireAuth, (req, res) => {
    const sub = req.user.username;
    const payload = {
      user_id: req.user.id,
      name: req.user.name,
    };
    // create and send authtoken
    res.send({
      authToken: AuthService.createJwt(sub, payload),
    });
  });

module.exports = authRouter;
