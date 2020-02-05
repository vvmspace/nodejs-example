const uuid = require('shortid');
const mongoose = require('../libs/mongoose');

const noticeSchema = new mongoose.Schema({
    uuid: {
        default: uuid.generate,
        index: true,
        type: String,
        unique: true,
    },
    message: String,
}, { timestamps: true, id: false });

module.exports = mongoose.model('notice', noticeSchema);
