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

// Mount routes at / (Serverless will handle the prefix)
app.use('/auth', authRoutes);
app.use('/flights', flightRoutes);
app.use('/bookings', bookingRoutes);

// Test routes for /api prefix just in case
app.use('/api/auth', authRoutes);
app.use('/api/flights', flightRoutes);
app.use('/api/bookings', bookingRoutes);

// Root & Health check routes
app.get('/', (req, res) => res.json({ status: 'success', message: 'Skysail API is live!' }));
app.get('/health', (req, res) => res.json({ status: 'healthy', db: mongoose.connection.readyState }));
app.get('/api', (req, res) => res.json({ status: 'success', message: 'Skysail API is live!' }));
app.get('/api/health', (req, res) => res.json({ status: 'healthy', db: mongoose.connection.readyState }));

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

