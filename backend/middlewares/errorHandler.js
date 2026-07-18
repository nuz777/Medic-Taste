function errorHandler(err, req, res, _next) {
  console.error('Error:', err.message);
  const status = err.status || 500;
  const message = status === 500 ? 'Error interno del servidor' : (err.message || 'Error');
  res.status(status).json({ error: message });
}

module.exports = errorHandler;
