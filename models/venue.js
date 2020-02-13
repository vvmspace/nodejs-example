const uuid = require('shortid');
const mongoose = require('../libs/mongoose');

const venueSchema = new mongoose.Schema({
    uuid: {
        default: uuid.generate,
        index: true,
        type: String,
        unique: true,
    },
    // todo: todo
    ssr: Boolean,
}, { timestamps: true, id: false });

module.exports = mongoose.model('venue', venueSchema);
