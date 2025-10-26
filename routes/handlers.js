const shortnerService = require('../services/shortnerServices');
const { ValidationError, NotFoundError } = require('../utils/errors');
const config = require('../config');

/**
 * Shared route handlers to eliminate code duplication
 */

/**
 * Handle URL shortening requests
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const handleShortenUrl = async (req, res) => {
  try {
    console.log(`🔄 Processing ${req.route.path} request`);
    console.log('Request body:', JSON.stringify(req.body, null, 2));

    const { url } = req.body;

    if (!url) {
      console.log('❌ No URL provided in request');
      throw new ValidationError('URL is required');
    }

    console.log('✅ URL provided:', url);

    const result = await shortnerService.shortenUrl(url);
    console.log('✅ Successfully processed request:', result);

    res.json(result);
  } catch (error) {
    console.error(`❌ Error in ${req.route.path}:`, error.message);
    console.error('Stack trace:', error.stack);

    if (error instanceof ValidationError) {
      return res.status(error.statusCode).json({ error: error.message });
    }

    res.status(500).json({
      error: 'Internal server error',
      details: config.server.env === 'development' ? error.message : undefined
    });
  }
};

/**
 * Handle redirect requests
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const handleRedirect = async (req, res) => {
  try {
    const { id } = req.params;
    console.log('🔄 Processing redirect for ID:', id);

    const originalUrl = await shortnerService.getOriginalUrl(id);

    if (!originalUrl) {
      console.log('❌ Link not found for ID:', id);
      throw new NotFoundError('Link not found');
    }

    console.log('✅ Redirecting to:', originalUrl);
    res.redirect(originalUrl);
  } catch (error) {
    console.error('❌ Error in redirect:', error.message);

    if (error instanceof NotFoundError) {
      return res.status(error.statusCode).json({ error: error.message });
    }

    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = {
  handleShortenUrl,
  handleRedirect
};
