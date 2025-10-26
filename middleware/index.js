/**
 * Middleware index file
 * Exports all middleware functions for easy importing
 */

const requestLogging = require('./logging');
const customBodyParser = require('./bodyParser');
const createRateLimit = require('./rateLimit');

module.exports = {
  requestLogging,
  customBodyParser,
  createRateLimit
};
