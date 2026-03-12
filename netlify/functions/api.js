const serverless = require('serverless-http');
const mongoose = require('mongoose');
const app = require('../../backend/server');

const handler = serverless(app);

module.exports.handler = async (event, context) => {
    // Force context to wait for the event loop to be empty
    context.callbackWaitsForEmptyEventLoop = false;

    console.log(`[NETLIFY] Incoming Request: ${event.httpMethod} ${event.path}`);
    
    try {
        if (mongoose.connection.readyState === 0) {
            console.log('[NETLIFY] Attempting to connect to MongoDB...');
            if (!process.env.MONGODB_URI) {
                console.error('[NETLIFY] ERROR: MONGODB_URI is missing from Environment Variables!');
                return { statusCode: 500, body: JSON.stringify({ message: "Database configuration missing" }) };
            }
            await mongoose.connect(process.env.MONGODB_URI, {
                serverSelectionTimeoutMS: 5000
            });
            console.log('[NETLIFY] MongoDB Connected Successfully');
        }
    } catch (err) {
        console.error('[NETLIFY] MongoDB Connection Failed:', err.message);
        return { statusCode: 500, body: JSON.stringify({ message: "Database connection failed", error: err.message }) };
    }

    return await handler(event, context);
};
