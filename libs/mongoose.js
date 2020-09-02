const mongoose = require('mongoose');

const log = require('./log');
const config = require('../config');

const CONNECTION_STRING = `${config.mongodb.host}/${config.mongodb.db}`;

require('mongoose-double')(mongoose);
mongoose.Promise = require('bluebird');
mongoose.set('useCreateIndex', true);

if (process.env.NODE_ENV !== 'test') {
    mongoose
        .connect(CONNECTION_STRING, config.mongodb.options)
        .then(() => log(`:: MONGOOSE CONNECTED > ${CONNECTION_STRING}`))
        .catch(error => log(error));
}

module.exports = mongoose;
