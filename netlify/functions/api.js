const serverless = require('serverless-http');
const mongoose = require('mongoose');
const app = require('../../backend/server');

// Create a handler that ensures DB connection
const handler = serverless(app);

module.exports.handler = async (event, context) => {
    // Make sure DB is connected before handling request
    if (mongoose.connection.readyState === 0) {
        console.log('Connecting to MongoDB via Netlify Function...');
        await mongoose.connect(process.env.MONGODB_URI);
    }
    
    // We must handle the serverless request
    return await handler(event, context);
};
