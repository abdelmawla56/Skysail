const serverless = require('serverless-http');
const mongoose = require('mongoose');
const app = require('../backend/server');

const handler = serverless(app);

module.exports = async (req, res) => {
    // Database connection check
    if (mongoose.connection.readyState === 0) {
        await mongoose.connect(process.env.MONGODB_URI);
    }
    
    // Vercel uses standard req/res objects
    return await handler(req, res);
};
