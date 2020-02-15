const cron = require('node-cron');

// Import tasks here:
const parse = require('./parse'); // simple task example

cron.schedule('0 0 */8 * * *', parse);