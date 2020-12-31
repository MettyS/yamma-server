  
const AuthService = require('../auth/auth-service');

function requireAuth(req, res, next) {
  // get the value of the 'Authorization' key in req headers
  const authToken = req.get('Authorization') || '';
  let bearerToken;
  // expect syntax to be that of bearer token
  if (!authToken.toLowerCase().startsWith('bearer ')) {
    return res.status(401).json({ error: 'Missing bearer token' });
  } else {
    bearerToken = authToken.slice(7, authToken.length);
  }
  try {
    // decode bearerToken into user information
    const payload = AuthService.verifyJwt(bearerToken);
    // try to find user in db
    AuthService.getUserWithUsername(
      req.app.get('db'),
      payload.sub,
    )
      .then(user => {
        // if user doesn't exist reject req
        if (!user)
          return res.status(401).json({ error: 'Unauthorized request' });

        // set a request variable to store user info 
        // so routes/services dealing with this request can have access to it
        req.user = user;
        next();
      })
      .catch(err => {
        next(err);
      })
  } catch(error) {
    res.status(401).json({ error: 'Unauthorized request' });
  }
}

module.exports = { requireAuth };