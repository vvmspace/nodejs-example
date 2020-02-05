// Simple example of cron task

const log = require('../libs/log');

const parse = () => {
    log('Parse something here (comment this in cron/index.js or modify cron/parse.js');
};


if (module) {
    module.exports = parse;
}