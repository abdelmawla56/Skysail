const express = require('express');
const router = express.Router();
const {
    createFlight,
    getFlights,
    getFlightById,
    updateFlight,
    deleteFlight,
    searchFlights,
} = require('../controllers/flightController');

router.get('/search', searchFlights);
router.get('/', getFlights);
router.get('/:id', getFlightById);

// Note: For simplicity, I'm not adding admin check but it's good practice
// Normally, only admins should be able to create, update, or delete flights.
router.post('/', createFlight);
router.put('/:id', updateFlight);
router.delete('/:id', deleteFlight);

module.exports = router;
