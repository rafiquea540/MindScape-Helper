const jwt = require('jsonwebtoken')

const auth = (req, res, next) => {
  try {
    // Check if Authorization header exists
    const authHeader = req.headers.authorization
    if (!authHeader) {
      return res.status(401).json({
        success: false,
        message: 'Authorization header missing',
      })
    }

    // Check if it follows Bearer token format
    if (!authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'Invalid token format. Use Bearer token',
      })
    }

    const token = authHeader.split(' ')[1]
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'No token provided',
      })
    }

    // Verify the token
    const verifyToken = jwt.verify(token, process.env.JWT_SECRET)
    if (!verifyToken) {
      return res.status(401).json({
        success: false,
        message: 'Invalid token',
      })
    }

    // Set user ID in request object
    req.locals = verifyToken.userId
    next()
  } catch (error) {
    // Handle specific JWT errors
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        message: 'Invalid token',
      })
    }
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Token expired',
      })
    }

    // Handle other errors
    console.error('Auth middleware error:', error)
    return res.status(500).json({
      success: false,
      message: 'Internal server error during authentication',
    })
  }
}

module.exports = auth
