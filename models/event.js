const uuid = require('shortid');
const mongoose = require('../libs/mongoose');

const eventSchema = new mongoose.Schema({
    uuid: {
        default: uuid.generate,
        index: true,
        type: String,
        unique: true,
    },
    alias: String,
    ponominalu_id: Number,
    name: String,
    title: String,
    description: String,
    date: Date,
    url: String,
    region: String,
    category: String,
    web_tag_groups: String,
    end_date: Date,
    date_type: Boolean,
    has_eticket: Boolean,
    min_price: Number,
    max_price: Number,
    image: String,
    age: Number,
    message: String,
    venue: {
        ref: 'venue',
        type: mongoose.Schema.Types.ObjectId,
    },
    ssr: Boolean,
}, { timestamps: true, id: false });

module.exports = mongoose.model('event', eventSchema);
