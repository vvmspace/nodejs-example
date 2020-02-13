const cron = require('node-cron');

// Import tasks here:
const parse = require('./parse'); // simple task example

cron.schedule('0 * * * * *', parse);