const router = require('express').Router();

const eventModel = require('../models/event');
const venueModel = require('../models/venue');

const services = {
    models: {
        event: eventModel,
        venue: venueModel,
    }
};
const _event = require('./event');
const _venue = require('./venue');

router.use('/api/v1/event', _event(services));
router.use('/api/v1/venue', _venue(services));

module.exports = router;
