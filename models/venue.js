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
    ponominalu_id: Number,
    location: {
        type: { type: String, enum: 'Point', default: 'Point' },
        coordinates: [Number],
    },
    name: String,
    alias: String,
    address: String,
    events: [{
        ref: 'event',
        type: mongoose.Schema.Types.ObjectId,
    }],
    ssr: Boolean,
}, { timestamps: true, id: false });

module.exports = mongoose.model('venue', venueSchema);
