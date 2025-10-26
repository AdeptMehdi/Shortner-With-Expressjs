const express = require('express');
const router = express.Router();
const { handleShortenUrl, handleRedirect } = require('./handlers');

// Health check route
router.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Shorten URL routes (consolidated logic)
router.post('/shorten', handleShortenUrl);
router.post('/shortenUrl', handleShortenUrl); // For backward compatibility

// Redirect to original URL route
router.get('/:id', handleRedirect);

module.exports = router;
