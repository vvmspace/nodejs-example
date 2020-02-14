const router = require('express').Router();
const VenueController = require('./controller');

module.exports = services => {
    const controller = new VenueController(services);
    router.get(
        '/:uuid',
        controller.getVenueByUuidOrAlias
    );
    router.get(
        '/',
        controller.getVenueList
    );
    return router;
}
