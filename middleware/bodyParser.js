const bodyParser = require('body-parser');

/**
 * Custom body parsing middleware with detailed logging
 * Handles JSON and URL-encoded data with proper error handling
 */
const customBodyParser = (req, res, next) => {
  if (req.method === 'POST' || req.method === 'PUT' || req.method === 'PATCH') {
    console.log('🔄 Processing body for', req.method, req.url);

    // Handle JSON
    if (req.is('application/json') || req.get('Content-Type')?.includes('json')) {
      let data = '';
      req.setEncoding('utf8');
      req.on('data', (chunk) => {
        data += chunk;
      });
      req.on('end', () => {
        console.log('📦 Raw JSON body received:', data);
        try {
          req.body = JSON.parse(data);
          console.log('✅ Successfully parsed JSON body:', JSON.stringify(req.body, null, 2));
          next();
        } catch (err) {
          console.error('❌ Failed to parse JSON:', err.message);
          return res.status(400).json({
            error: 'Invalid JSON format',
            details: err.message
          });
        }
      });
    } else {
      // Use body-parser for other content types
      console.log('📝 Using body-parser for non-JSON content');
      bodyParser.json({ limit: '10mb' })(req, res, next);
    }
  } else {
    next();
  }
};

module.exports = customBodyParser;
