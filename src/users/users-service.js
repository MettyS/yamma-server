const bcrypt = require('bcryptjs');

const UsersService = {
  getUsers(db) {
    return db('users')
      .select('*');
  },
  addUser(db, user) {
    return db('users')
      .insert(user)
      .returning('*')
      .then( ([addedUser]) => addedUser);
  },
  deleteUser(db, id) {
    return db('users')
      .where({ id })
      .delete();
  },
  getUsersByName(db, name) {
    return db('users')
      .select('*')
      .where('username', name)
      .first();
  },
  getUserById(db, userId) {
    return db('users')
      .select('*')
      .where('id', userId)
      .first();
  },
  getUsersByEmail(db, email) {
    return db('users')
      .select('*')
      .where({ email })
      .first();
  },
//   validateEmailAndNicknameSyntax(email, nickname) {
//     const emailPatt = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
//     if(!emailPatt.test(email))
//       return 'Invalid email';
    
//     const nicknamePatt = /\W/ 
//     const nicknamePatt2 = /\s/
//     if(nickname.match(nicknamePatt) || nickname.match(nicknamePatt2))
//       return 'Invalid nickname';

//     return false;
//   },

// // must be unique
//   validateEmailAndNickname(db, email, nickname) {

//     let isError = false;
//     return this.getUsersByEmail(db, email)
//     .then(user => {
//       if(user){
//         isError = 'Email or username is already in use';
//       }
//       return this.getUsersByName(db, nickname)
//       .then(user => {
//         if(user){
//           isError = 'Email or username is already in use';
//         }

//         return isError;
//       })
//     })
//     .catch(res => {
//       console.log('entered catch, the baderror is, ', res);
//       return '>>>>>>>>>>>>>>>>>Some Error';
//     });
//   },
//   validatePassword(password) {
//     // at least 8 chars, 
//     // at least one alpha and one special character

//     const patty = /[!@#$%&*()_+=|<>?{}\[\]~-]/;
//     const specialExists = password.match(patty);

//     const pat = /[A-Z]/;
//     const capitalExists = password.match(pat);

//     return (specialExists && capitalExists && password.length >= 8) ? false : 'Invalid password';
//   },
  generatePasswordHash(password) {
    return bcrypt.hash(password, 8);
  }
  
  };
  
  module.exports = UsersService;