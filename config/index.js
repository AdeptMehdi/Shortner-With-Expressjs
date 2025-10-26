require('dotenv').config();

/**
 * Application configuration
 * Centralized configuration management with environment variable support
 */
const config = {
  // Server configuration
  server: {
    port: process.env.PORT || 4000,
    host: process.env.HOST || 'localhost',
    env: process.env.NODE_ENV || 'development'
  },

  // URL configuration
  url: {
    baseUrl: process.env.BASE_URL || 'http://localhost:4000',
    maxLength: parseInt(process.env.MAX_URL_LENGTH) || 2048
  },

  // Security configuration
  security: {
    rateLimit: {
      windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 minutes
      maxRequests: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100
    },
    cors: {
      origin: process.env.CORS_ORIGIN || '*',
      credentials: process.env.CORS_CREDENTIALS === 'true'
    }
  },

  // Logging configuration
  logging: {
    level: process.env.LOG_LEVEL || 'info',
    enableConsole: process.env.LOG_CONSOLE !== 'false',
    enableFile: process.env.LOG_FILE === 'true'
  },

  // Storage configuration (for future database integration)
  storage: {
    type: process.env.STORAGE_TYPE || 'memory', // 'memory' or 'database'
    database: {
      url: process.env.DATABASE_URL,
      name: process.env.DATABASE_NAME || 'shortner_db'
    }
  }
};

module.exports = config;
