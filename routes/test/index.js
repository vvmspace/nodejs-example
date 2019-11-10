const router = require('express').Router();
const TestController = require('./controller');

module.exports = services => {
    const controller = new TestController(services);
    router.get('/text', controller.text);
    router.get('/', controller.index);

    return router;
}
