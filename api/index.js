const mongoose = require('mongoose');
const app = require('../backend/server');

module.exports = async (req, res) => {
    try {
        if (mongoose.connection.readyState === 0) {
            console.log('Connecting to MongoDB...');
            await mongoose.connect(process.env.MONGODB_URI, {
                serverSelectionTimeoutMS: 5000,
            });
        }
        // Directly handle the request with Express
        return app(req, res);
    } catch (err) {
        console.error('Vercel API Error:', err.message);
        res.status(500).json({ error: 'Internal Server Error', details: err.message });
    }
};
