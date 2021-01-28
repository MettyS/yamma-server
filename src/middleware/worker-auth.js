
function requireWorkerAuth(req, res, next) {
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
    if (bearerToken !== process.env.WORKER_KEY) return res.status(404).end();
    next();
  } catch (error) {
    res.status(404).end();
  }
}

module.exports = requireWorkerAuth;
