const config = require('./config');
const express = require('express');
const body = require('body-parser');
const app = express();
const log = require('./libs/log');
const routes = require('./routes');
const errorHandler = require('./middlewares/errorHandler');
const useragent = require('express-useragent');
require('./cron');

const {port, host} = config.server;

async function start() {
    app.use(body.urlencoded({ extended: true, limit: "50mb" }));
    app.use(body.json({ limit: "50mb" }));

    app.get('/', (req, res) => {
        res.json({text: 'Welcome'});
    });
    app.use(useragent.express());
    app.use(routes);
    app.use(errorHandler);

    app.listen(port, host, () => {
        log(`Listening ${host}:${port}`);
    });
}

start();
