function errorHandler(err, req, res, next) {
  console.error(err);
  res.status(err.status || 500).json({ status:0, error: err.message || 'Server error' });
}

module.exports = errorHandler;
