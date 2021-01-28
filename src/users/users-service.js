const bcrypt = require('bcryptjs');

class ValidationError extends Error {
  constructor(type = null, message) {
    super(message);
    this.validationError = true;
    switch (type.toLowerCase()) {
      case 'email':
        this.errorType = type;
        break;
      case 'password':
        this.errorType = type;
        break;
      case 'username':
        this.errorType = type;
        break;
      default:
        this.errorType = type;
    }
  }
}

const UsersService = {
  // get all users
  getUsers(db) {
    return db('users').select('*');
  },
  // get user with name
  getUsersByName(db, name) {
    return db('users').select('*').where('username', name).first();
  },
  // get user with id
  getUserById(db, userId) {
    return db('users').select('*').where('id', userId).first();
  },
  // get user with email
  getUsersByEmail(db, email) {
    return db('users').select('*').where({ email }).first();
  },
  // add a user
  addUser(db, user) {
    return db('users')
      .insert({
        username: user.username,
        password: user.password,
        email: user.email,
      })
      .returning('*')
      .then(([addedUser]) => addedUser);
  },
  /* NOT IN USE */
  // delete a user
  deleteUser(db, id) {
    return db('users').where({ id }).delete();
  },

  /* validation helpers */
  // email and username input validation
  validateEmailAndUsernameSyntax(email, username) {
    const emailPatt = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (!emailPatt.test(email))
      throw new ValidationError('email', 'Invalid email');

    const usernamePatt = /\W/;
    const usernamePatt2 = /\s/;
    if (username.match(usernamePatt) || username.match(usernamePatt2))
      throw new ValidationError('username', 'Invalid username');
  },
  // validate email and username are unique
  async validateEmailAndUsername(db, email, username) {
    try {
      let user = await this.getUsersByEmail(db, email);
      if (user) throw new ValidationError('email', 'Email is already in use');
      user = await this.getUsersByName(db, username);
      if (user)
        throw new ValidationError('username', 'Username is already in use');
    } catch (e) {
      throw e;
    }
  },
  // validate password meets requirements
  validatePassword(password) {
    // at least 8 chars,
    // at least one alpha and one special character

    const patty = /[!@#$%&*()_+=|<>?{}\[\]~-]/;
    const specialExists = password.match(patty);

    const pat = /[A-Z]/;
    const capitalExists = password.match(pat);

    if (!specialExists || !capitalExists || !(password.length >= 8))
      throw new ValidationError(
        'password',
        'Password must contain at least one special character, one number, and one capital letter, and must be at least 8 characters long.'
      );
  },
  // encrypt password
  hashPassword(password) {
    return bcrypt.hash(password, 12);
  },
};

module.exports = UsersService;
