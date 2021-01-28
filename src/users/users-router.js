const express = require('express');
const path = require('path');
const xss = require('xss');
const UsersService = require('./users-service');
const AuthService = require('../auth/auth-service');

const usersRouter = express.Router();
const jsonParser = express.json();

// HELPER:
const serializeUser = (user) => {
  return {
    id: user.id || null,
    username: xss(user.username),
    email: xss(user.email),
    date_created: new Date(xss(user.date_created)) || null,
  };
};

// TODO /users/
usersRouter
  .route('/')
  .get((req, res, next) => {
    /* IMPLEMENT ME */
  })
  .post(jsonParser, async (req, res, next) => {
    /*
    sign up endpoint
      returns a valid jwt as { authToken: "jwtString" }
    */
    for (const field of ['username', 'password', 'email'])
      if (!req.body[field])
        return res.status(400).json({
          error: `Missing '${field}' in request body`,
        });
    try {
      const user = serializeUser(req.body);
      user.password = req.body.password;
      // validate syntax
      UsersService.validatePassword(user.password);
      UsersService.validateEmailAndUsernameSyntax(user.email, user.username);

      //check for db availability of email and username
      await UsersService.validateEmailAndUsername(
        req.app.get('db'),
        user.email,
        user.username
      );
      user.password = await UsersService.hashPassword(user.password);
      // adds user to db and serializes the returning object
      const addedUser = serializeUser(
        await UsersService.addUser(req.app.get('db'), user)
      );
      const payload = { id: addedUser.id };
      
      return res.status(201).json({
        authToken: AuthService.createJwt(addedUser.username, payload),
      });
    } catch (e) {
      if (e.validationError)
        return res.status(400).json({ message: e.message });
      next(e);
    }
  });

// TODO /users/:user_id
usersRouter
  .route('/:user_id')
  .all((req, res, next) => {
    const { user_id } = req.params;
    UsersService.getUserById(req.app.get('db'), user_id)
      .then((userWithId) => {
        if (!userWithId)
          return res
            .status(404)
            .json({ error: { message: `User does not exist` } });

        res.user = userWithId;
        next();
      })
      .catch(next);
  })
  .get((req, res) => {
    res.json(UsersService.serializeUser(res.user));
  })
  .delete((req, res, next) => {
    /* IMPLEMENT ME */
  });

module.exports = usersRouter;
