const router = require('express').Router();
const EventController = require('./controller');

module.exports = services => {
    const controller = new EventController(services);
    router.get(
        '/:uuid',
        controller.getEventByUuid
    );
    return router;
};
