const Booking = require('../models/Booking');
const Flight = require('../models/Flight');

// @desc    Create new booking
// @route   POST /api/bookings
// @access  Private
exports.createBooking = async (req, res) => {
    const { flightId, numSeats } = req.body;

    try {
        const flight = await Flight.findById(flightId);

        if (!flight) {
            return res.status(404).json({ message: 'Flight not found' });
        }

        if (flight.availableSeats < numSeats) {
            return res.status(400).json({ message: 'Not enough seats available' });
        }

        const pricePerSeat = flight.price;
        const totalPrice = pricePerSeat * (numSeats || 1);

        const booking = await Booking.create({
            userId: req.user._id,
            flightId,
            numSeats: numSeats || 1,
            totalPrice,
            status: 'confirmed',
        });

        // Reduce available seats
        flight.availableSeats -= (numSeats || 1);
        await flight.save();

        res.status(201).json(booking);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get user's bookings
// @route   GET /api/bookings/my
// @access  Private
exports.getUserBookings = async (req, res) => {
    try {
        const bookings = await Booking.find({ userId: req.user._id }).populate('flightId');
        res.json(bookings);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update booking status (cancel)
// @route   PUT /api/bookings/:id
// @access  Private
exports.updateBookingStatus = async (req, res) => {
    const { status } = req.body;

    try {
        const booking = await Booking.findById(req.params.id);

        if (!booking) {
            return res.status(404).json({ message: 'Booking not found' });
        }

        // Ensure the booking belongs to the user
        if (booking.userId.toString() !== req.user._id.toString()) {
            return res.status(401).json({ message: 'Not authorized' });
        }

        if (status === 'canceled' && booking.status !== 'canceled') {
            // Restore seats to the flight
            const flight = await Flight.findById(booking.flightId);
            if (flight) {
                flight.availableSeats += booking.numSeats;
                await flight.save();
            }
        }

        booking.status = status || booking.status;
        const updatedBooking = await booking.save();

        res.json(updatedBooking);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
