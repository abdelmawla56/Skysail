const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    flightId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Flight',
        required: true,
    },
    bookingDate: {
        type: Date,
        default: Date.now,
    },
    numSeats: {
        type: Number,
        default: 1,
    },
    totalPrice: {
        type: Number,
    },
    status: {
        type: String,
        enum: ['confirmed', 'canceled'],
        default: 'confirmed',
    },
}, { timestamps: true });

module.exports = mongoose.model('Booking', bookingSchema);
