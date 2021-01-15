const jwt = require('jsonwebtoken')

// CHECK IF USER IS LOGGED IN AND VERIFIED
module.exports = function (req, res, next) {
  const token = req.header('auth-token')
  if (!token) {
    return res.status(401).send('Access denied, you need to log in')
  }
  try {
    const verified = jwt.verify(token, process.env.TOKEN_SECRET)
    req.user = verified
    next()
  } catch (err) {
    res.status(400).send('Invalid token')
  }
}
