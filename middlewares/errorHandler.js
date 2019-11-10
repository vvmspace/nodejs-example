const log = require('../libs/log');

module.exports = (err, req, res) => {
    if (err.status) {
        return res.status(err.status).end(err.message || err.status);
    }

    log(err);
    return res.status(500).end('internal_server_error');
};
