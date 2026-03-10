const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Flight = require('./models/Flight');
const User = require('./models/User');

dotenv.config();

const flights = [
    {
        flightNumber: 'SKY-2026-001',
        from: 'Cairo',
        to: 'Dubai',
        date: new Date('2026-06-15T10:00:00'),
        totalSeats: 150,
        availableSeats: 150,
        price: 450
    },
    {
        flightNumber: 'SKY-2026-002',
        from: 'London',
        to: 'New York',
        date: new Date('2026-07-20T14:30:00'),
        totalSeats: 200,
        availableSeats: 185,
        price: 850
    },
    {
        flightNumber: 'SKY-2026-003',
        from: 'Paris',
        to: 'Tokyo',
        date: new Date('2026-08-10T08:00:00'),
        totalSeats: 180,
        availableSeats: 45,
        price: 1200
    },
    {
        flightNumber: 'SKY-2026-004',
        from: 'Rome',
        to: 'Paris',
        date: new Date('2026-09-05T16:00:00'),
        totalSeats: 120,
        availableSeats: 120,
        price: 300
    }
];

const seedDB = async () => {
    try {
        if (!process.env.MONGODB_URI) {
            throw new Error('MONGODB_URI is not defined in .env');
        }

        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB for seeding...');

        // Clear existing data
        await Flight.deleteMany();
        await User.deleteMany();

        // Seed flights
        await Flight.insertMany(flights);
        console.log('Flights Seeded Successfully!');

        // Seed a demo user (password will be hashed by User model pre-save hook)
        const demoUser = new User({
            name: 'Demo User',
            email: 'demo@example.com',
            password: 'password123',
            isVerified: true
        });
        await demoUser.save();
        console.log('Demo User Seeded Successfully! (demo@example.com / password123)');

        console.log('Database Initialization Complete!');
        process.exit();
    } catch (error) {
        console.error('Error seeding database:', error.message);
        process.exit(1);
    }
};

seedDB();

