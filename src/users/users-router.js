const express = require('express');
const path = require('path'); 
const UsersService = require('./users-service');
const usersRouter = express.Router();
const jsonParser = express.json();
const xss = require('xss');


// HELPER:
const serializeUser = (user) => {
  return {
    id: user.id,
    nickname: xss(user.nickname),
    email: xss(user.email),
    date_created: user.date_created
  }
}



// TODO /users/
usersRouter.route('/')
  .get((req, res, next) => {/* IMPLEMENT ME */})
  .post(jsonParser, (req, res, next) => {/* IMPLEMENT ME */})

// TODO /users/:user_id
usersRouter.route('/:user_id')
  .all( (req, res, next) => {
    const { user_id } = req.params;
    UsersService.getUserById(req.app.get('db'), user_id)
      .then(userWithId => {
        if(!userWithId) 
          return res.status(404).json({ error: {message: `User does not exist`} });
        
        res.user = userWithId;
        next();
      })
      .catch(next);
  })
  .get( (req, res) => {
    res.json(UsersService.serializeUser(res.user));
  })
  .delete( (req, res, next) => {/* IMPLEMENT ME */})


  module.exports = usersRouter;