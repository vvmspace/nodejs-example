const log = require('../libs/log');

module.exports = function(err, req, res, next) {
    log(err);
    // TODO: some bug with res.status
    if (err.status) {
        return res.status && res.status(err.status).end(err.message || err.status);
    }

    return res.status(500).end('internal_server_error');
};
