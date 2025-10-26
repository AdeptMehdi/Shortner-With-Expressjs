const { ValidationError } = require('./errors');
const config = require('../config');

/**
 * Enhanced URL validation with security checks
 * @param {string} url - URL to validate
 * @returns {boolean} - True if valid
 * @throws {ValidationError} - If URL is invalid or malicious
 */
const validateUrl = (url) => {
  if (!url) {
    throw new ValidationError('URL is required');
  }

  // Check URL length
  if (url.length > config.url.maxLength) {
    throw new ValidationError(`URL too long (max ${config.url.maxLength} characters)`);
  }

  // Basic URL format validation
  try {
    const urlObj = new URL(url);

    // Only allow HTTP and HTTPS protocols
    if (!['http:', 'https:'].includes(urlObj.protocol)) {
      throw new ValidationError('Only HTTP and HTTPS protocols are allowed');
    }

    // Check for suspicious patterns
    const suspiciousPatterns = [
      'javascript:',
      'data:',
      'vbscript:',
      'file:',
      'ftp:',
      '<script',
      'onload=',
      'onerror='
    ];

    const lowerUrl = url.toLowerCase();
    for (const pattern of suspiciousPatterns) {
      if (lowerUrl.includes(pattern)) {
        throw new ValidationError('URL contains potentially malicious content');
      }
    }

    return true;
  } catch (err) {
    if (err instanceof ValidationError) {
      throw err;
    }
    throw new ValidationError('Invalid URL format');
  }
};

/**
 * Validate short ID format
 * @param {string} shortId - Short ID to validate
 * @returns {boolean} - True if valid
 * @throws {ValidationError} - If short ID is invalid
 */
const validateShortId = (shortId) => {
  if (!shortId) {
    throw new ValidationError('Short ID is required');
  }

  // Short ID should be alphanumeric and reasonable length
  if (!/^[a-zA-Z0-9]{1,32}$/.test(shortId)) {
    throw new ValidationError('Invalid short ID format');
  }

  return true;
};

/**
 * Sanitize input string
 * @param {string} input - Input to sanitize
 * @returns {string} - Sanitized input
 */
const sanitizeInput = (input) => {
  if (typeof input !== 'string') {
    return '';
  }

  return input
    .trim()
    .replace(/[<>]/g, '') // Remove potential HTML tags
    .substring(0, config.url.maxLength); // Limit length
};

module.exports = {
  validateUrl,
  validateShortId,
  sanitizeInput
};
