const router = require('express').Router();
const EventController = require('./controller');

module.exports = services => {
    const controller = new EventController(services);

    router.get(
        '/',
        controller.getEventIndex
    );

    router.get(
        '/rap',
        controller.getRap
    );

    router.get(
        '/pop',
        controller.getRap
    );

    router.get(
        '/rock',
        controller.getRock
    );

    router.get(
        '/today',
        controller.getToday
    );

    router.get(
        '/tomorrow',
        controller.getTomorrow
    );

    router.get(
        '/weekends',
        controller.getWeekends
    );

    router.get(
        '/weekly',
        controller.getWeekly
    );

    router.get(
        '/:uuid',
        controller.getEventByUuid
    );

    return router;
};
