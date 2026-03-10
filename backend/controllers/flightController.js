const Flight = require('../models/Flight');

// @desc    Create new flight
// @route   POST /api/flights
// @access  Private/Admin
exports.createFlight = async (req, res) => {
    const { flightNumber, from, to, date, totalSeats, price } = req.body;

    try {
        const flightExists = await Flight.findOne({ flightNumber });

        if (flightExists) {
            return res.status(400).json({ message: 'Flight already exists' });
        }

        const flight = await Flight.create({
            flightNumber,
            from,
            to,
            date,
            totalSeats,
            availableSeats: totalSeats,
            price,
        });

        res.status(201).json(flight);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get all flights
// @route   GET /api/flights
// @access  Public
exports.getFlights = async (req, res) => {
    try {
        const flights = await Flight.find({});
        res.json(flights);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get flight by ID
// @route   GET /api/flights/:id
// @access  Public
exports.getFlightById = async (req, res) => {
    try {
        const flight = await Flight.findById(req.params.id);

        if (flight) {
            res.json(flight);
        } else {
            res.status(404).json({ message: 'Flight not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update light
// @route   PUT /api/flights/:id
// @access  Private/Admin
exports.updateFlight = async (req, res) => {
    try {
        const flight = await Flight.findById(req.params.id);

        if (flight) {
            flight.flightNumber = req.body.flightNumber || flight.flightNumber;
            flight.from = req.body.from || flight.from;
            flight.to = req.body.to || flight.to;
            flight.date = req.body.date || flight.date;
            flight.totalSeats = req.body.totalSeats || flight.totalSeats;
            flight.availableSeats = req.body.availableSeats || flight.availableSeats;
            flight.price = req.body.price || flight.price;

            const updatedFlight = await flight.save();
            res.json(updatedFlight);
        } else {
            res.status(404).json({ message: 'Flight not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Delete flight
// @route   DELETE /api/flights/:id
// @access  Private/Admin
exports.deleteFlight = async (req, res) => {
    try {
        const flight = await Flight.findById(req.params.id);

        if (flight) {
            await flight.deleteOne();
            res.json({ message: 'Flight removed' });
        } else {
            res.status(404).json({ message: 'Flight not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Search flights
// @route   GET /api/flights/search
// @access  Public
exports.searchFlights = async (req, res) => {
    const { from, to, date } = req.query;

    try {
        let query = {};

        if (from) {
            query.from = { $regex: from, $options: 'i' };
        }

        if (to) {
            query.to = { $regex: to, $options: 'i' };
        }

        if (date) {
            const searchDate = new Date(date);
            const startOfDay = new Date(searchDate.setHours(0, 0, 0, 0));
            const endOfDay = new Date(searchDate.setHours(23, 59, 59, 999));
            query.date = { $gte: startOfDay, $lte: endOfDay };
        }

        const flights = await Flight.find(query);
        res.json(flights);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
