const router = require('express').Router();

const noticeModel = require('../models/notice');

const services = {
    models: {
        notice: noticeModel,
    }
};
const _test = require('./test');

router.use('/api/test', _test(services));

module.exports = router;
