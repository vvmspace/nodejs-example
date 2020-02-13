const log = require('../libs/log');

module.exports = (err, req, res) => {
    log(err);
    if (err.status) {
        return res.status(err.status).end(err.message || err.status);
    }

    return res.status(500).end('internal_server_error');
};
