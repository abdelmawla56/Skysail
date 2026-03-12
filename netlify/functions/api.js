const serverless = require('serverless-http');
const mongoose = require('mongoose');
const app = require('../../backend/server');

const handler = serverless(app);

module.exports.handler = async (event, context) => {
    // Prevent the function from hanging if there are open connections
    context.callbackWaitsForEmptyEventLoop = false;

    // Log the path for debugging
    console.log(`[NETLIFY] Request: ${event.httpMethod} ${event.path}`);
    
    try {
        // Ensure Database connection
        if (mongoose.connection.readyState === 0) {
            console.log('[NETLIFY] Connecting to DB...');
            await mongoose.connect(process.env.MONGODB_URI, {
                serverSelectionTimeoutMS: 5000,
                socketTimeoutMS: 45000,
            });
        }
    } catch (err) {
        console.error('[NETLIFY] DB Connection Error:', err.message);
        // We'll still try to handle the request, but it will likely fail 
        // with a 500 error from Mongoose if the connection is dead.
    }

    // Pass the request to serverless-http
    return await handler(event, context);
};
