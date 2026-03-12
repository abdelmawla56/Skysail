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

// Request logger
app.use((req, res, next) => {
    console.log(`Path: ${req.path}`);
    next();
});

// Import routes
const authRoutes = require('./routes/authRoutes');
const flightRoutes = require('./routes/flightRoutes');
const bookingRoutes = require('./routes/bookingRoutes');
const seedController = require('./controllers/seedController');

// Helper to mount all routes
const mountRoutes = (prefix = '') => {
    app.use(`${prefix}/auth`, authRoutes);
    app.use(`${prefix}/flights`, flightRoutes);
    app.use(`${prefix}/bookings`, bookingRoutes);
    app.get(`${prefix}/seed`, seedController);
    
    // Root & Health check routes
    app.get(`${prefix}/`, (req, res) => res.json({ status: 'success', message: 'Skysail API is live!', path: req.path }));
    app.get(`${prefix}/api`, (req, res) => res.json({ status: 'success', message: 'Skysail API is live!' }));
    app.get(`${prefix}/health`, (req, res) => res.json({ status: 'healthy', db: mongoose.connection.readyState }));
};

// Mount at all possible variations for maximum compatibility
mountRoutes('');
mountRoutes('/api');
mountRoutes('/.netlify/functions/api');
mountRoutes('/.netlify/functions/api/api');

const connectDB = async () => {
    if (mongoose.connection.readyState >= 1) return;
    
    if (!process.env.MONGODB_URI) {
        console.error('CRITICAL ERROR: MONGODB_URI environment variable is missing!');
        return;
    }

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

// Global Error Handler
app.use((err, req, res, next) => {
    console.error('SERVER ERROR:', err.message);
    res.status(err.status || 500).json({
        message: err.message || 'Internal Server Error',
        code: err.code || 'UNKNOWN_ERROR'
    });
});

// Local server listener
if (process.env.NODE_ENV !== 'production') {
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
}

