const logger = require('../utils/logger');

const errorHandler = (err, req, res, next) => {
  logger.error('Hata:', {
    message: err.message,
    stack: err.stack,
    path: req.path,
    method: req.method,
    ip: req.ip
  });

  res.status(err.statusCode || 500).json({
    success: false,
    error: err.message || 'Sunucu hatası'
  });
};

module.exports = errorHandler;