const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Request logger for debugging serverless
app.use((req, res, next) => {
    console.log(`${req.method} ${req.path}`);
    next();
});

// Import routes
const authRoutes = require('./routes/authRoutes');
const flightRoutes = require('./routes/flightRoutes');
const bookingRoutes = require('./routes/bookingRoutes');

// Helper to apply routes with and without /api prefix
const applyRoutes = (prefix) => {
    app.use(`${prefix}/auth`, authRoutes);
    app.use(`${prefix}/flights`, flightRoutes);
    app.use(`${prefix}/bookings`, bookingRoutes);
};

// Handle both Netlify (/flights) and Local/Traditional (/api/flights)
applyRoutes('/api');
applyRoutes(''); // Fallback for serverless where /api might be stripped

const connectDB = async () => {
    if (mongoose.connection.readyState >= 1) return;
    try {
        console.log('Connecting to MongoDB...');
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('MongoDB Connected');
    } catch (error) {
        console.error(`MongoDB Connection Error: ${error.message}`);
    }
};

connectDB();

// Basic route for testing
// Basic route for testing
const path = require('path');

// Export app for serverless
module.exports = app;

// Local server listener
if (process.env.NODE_ENV !== 'production') {
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
}

