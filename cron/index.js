const cron = require('node-cron');

// Import tasks here:
const parse = require('./parse'); // simple task example
const sitemap = require('./sitemap');

if (process.env.cron_parse) {
    cron.schedule('0 0 0 * * *', parse);
}

if (process.env.cron_sitemap) {
    cron.schedule('0 16 * * * *', sitemap);
}
