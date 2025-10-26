/**
 * Request logging middleware
 * Logs all incoming requests with headers and body information
 */
const requestLogging = (req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  console.log('Headers:', JSON.stringify(req.headers, null, 2));

  if (req.body && Object.keys(req.body).length > 0) {
    console.log('Body:', JSON.stringify(req.body, null, 2));
  }

  next();
};

module.exports = requestLogging;
