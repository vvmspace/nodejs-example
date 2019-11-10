const router = require('express').Router();
const services = {};
const _test = require('./test');

router.use('/api/test', _test(services));

module.exports = router;
