// Error handler
const errorHandler = (err, req, res, next) => {
  console.error('Error:', err);

  // checking is error is validation error or not
  if (err.name === 'ValidationError') {
    return res.status(400).json({
      success: false,
      message: 'Validation Error',
      errors: err.errors
    });
  }

  // Check database error
  if (err.code && (err.code.startsWith('23') || err.code.startsWith('22'))) {
   
    return res.status(400).json({
      success: false,
      message: 'Database Error',
      error: err.detail || err.message
    });
  }

  // Check if error is a JWT error
  if (err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError') {
    return res.status(401).json({
      success: false,
      message: 'Authentication Error',
      error: 'Invalid or expired token'
    });
  }

  // 500 server error
  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || 'Server Error',
    error: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
};

const notFound = (req, res, next) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  error.statusCode = 404;
  next(error);
};

module.exports = {
  errorHandler,
  notFound
};
