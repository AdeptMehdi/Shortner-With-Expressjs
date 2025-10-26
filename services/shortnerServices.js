const crypto = require('crypto');
const { validateUrl, sanitizeInput } = require('../utils/validation');
const config = require('../config');

// In-memory storage for links (in production, use a database)
const links = {};

/**
 * Generate a short ID for the URL
 * @returns {string} - Random hex string
 */
const generateShortId = () => {
  return crypto.randomBytes(4).toString('hex');
};

/**
 * Shorten a URL
 * @param {string} originalUrl - The original URL to shorten
 * @returns {Object} - Object containing shortUrl and originalUrl
 */
const shortenUrl = async (originalUrl) => {
  try {
    console.log('🔧 Service: shortenUrl called with:', originalUrl);

    // Sanitize input
    const sanitizedUrl = sanitizeInput(originalUrl);

    // Validate URL using enhanced validation
    validateUrl(sanitizedUrl);

    const shortId = generateShortId();
    console.log('🎲 Service: Generated short ID:', shortId);

    links[shortId] = sanitizedUrl;
    console.log('💾 Service: Stored URL in memory:', { shortId, originalUrl: sanitizedUrl });

    const result = {
      shortUrl: `${config.url.baseUrl}/${shortId}`,
      originalUrl: sanitizedUrl
    };

    console.log('✅ Service: Successfully shortened URL:', result);
    return result;
  } catch (error) {
    console.error('❌ Service: Error in shortenUrl:', error.message);
    console.error('Stack:', error.stack);
    throw error;
  }
};

/**
 * Get original URL by short ID
 * @param {string} shortId - The short ID
 * @returns {string|null} - Original URL or null if not found
 */
const getOriginalUrl = async (shortId) => {
  try {
    return links[shortId] || null;
  } catch (error) {
    throw error;
  }
};

/**
 * Get all stored links (for debugging/testing)
 * @returns {Object} - All stored links
 */
const getAllLinks = () => {
  return { ...links };
};

module.exports = {
  shortenUrl,
  getOriginalUrl,
  getAllLinks
};
