const cron = require('node-cron');

// Import tasks here:
const parse = require('./parse'); // simple task example

if (process.env.cron_parse) {
    cron.schedule('0 0 0 * * *', parse);
}
