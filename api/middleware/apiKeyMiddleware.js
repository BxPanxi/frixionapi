// /middleware/apiKeyMiddleware.js
const dotenv = require('dotenv');
dotenv.config();  // Load environment variables

const checkApiKey = (req, res, next) => {
  const apiKey = req.header('x-api-key');  // Look for the 'x-api-key' header

  // Log the received API key for debugging purposes
  console.log('Received API Key:', apiKey);

  if (apiKey === process.env.API_KEY) {
    return next();  // If valid, proceed to the next middleware or route handler
  } else {
    return res.status(403).json({ message: 'Forbidden: Invalid API key' });  // Reject with 403 Forbidden
  }
};

module.exports = checkApiKey;
