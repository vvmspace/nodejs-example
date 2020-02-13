// Simple example of cron task

const log = require('../libs/log');
const {exec} = require('node-exec-promise');
const path = require('path');
const {server} = require('../config');
log(server);
const url = `${server.protocol}://${server.host}:${server.port}`;
const parse = () => {
    const tmpdir = path.join(__dirname + '/../tmp');
    exec(`wget ${url} -O ${tmpdir}/temp`)
        .then(() => {
            log('Parse something here (comment this in cron/index.js or modify cron/parse.js');
        })
        .catch(e => log(e.message));
};


if (module) {
    module.exports = parse;
}