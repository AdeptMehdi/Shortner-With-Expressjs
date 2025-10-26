const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const bodyParser = require('body-parser');
const config = require('./config');
const { requestLogging, customBodyParser, createRateLimit } = require('./middleware');
const shortnerRoutes = require('./routes/shortnerRoutes');

const app = express();

// Security middleware with enhanced configuration
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
}));

// CORS with configuration
app.use(cors(config.security.cors));

// Rate limiting
app.use(createRateLimit);

// Custom middleware
app.use(requestLogging);
app.use(customBodyParser);
app.use(bodyParser.urlencoded({ extended: true, limit: '10mb' }));

// Routes
app.use('/', shortnerRoutes);

// Start server only if not in test environment
if (require.main === module) {
  app.listen(config.server.port, () => {
    console.log(`Server running on port ⚡ ${config.server.port}`);
  });
}

module.exports = app;
