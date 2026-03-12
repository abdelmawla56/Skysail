const Flight = require('../models/Flight');
const User = require('../models/User');

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
    }
];

const seedRoute = async (req, res) => {
    try {
        await Flight.deleteMany();
        await Flight.insertMany(flights);
        
        // Seed demo user
        await User.deleteMany();
        const demoUser = new User({
            name: 'Demo User',
            email: 'demo@example.com',
            password: 'password123',
            isVerified: true
        });
        await demoUser.save();

        res.json({ message: 'Database Seeded Successfully!' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

module.exports = seedRoute;
