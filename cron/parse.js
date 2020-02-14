// Simple example of cron task

const {promises:fs} = require('fs');
const Promise = require('bluebird');
const parser = require('fast-xml-parser');
const log = require('../libs/log');
const {exec} = require('node-exec-promise');
const path = require('path');
const {server} = require('../config');
log(server);
const url = 'https://storage.vvm.space/partner_events_feed_export.xml';
const tmpdir = path.join(__dirname + '/../tmp');
const filename = `${tmpdir}/partner_events_feed_export.xml`;
const bar = require('cli-progress');
const eventSchema = require('../models/event');

const parse = () => {
    exec(`wget ${url} -O ${filename}`)
        .then(async () => {
            await parse_xml();
        })
        .catch(e => log(e));
};

const parse_xml = async () => {

    // const obj = parser.parse();
    const xml = await fs.readFile(filename,  "utf8");
    const obj = parser.parse(xml);
    const events = obj.event_for_export_list.event_for_export_row;
    let i = 0;
    bar.start(events.length, 0);
    await Promise.all(events.map(async (_event) => {
        const event = await eventSchema.findOne({ponominalu_id: _event.id}).then(e => e || eventSchema.create({ponominalu_id: _event.id}));
        event.ponominalu_id = _event.id;
        event.name = _event.title;
        event.title = _event.title;
        event.description = _event.description;
        event.date = _event.date;
        event.end_date = _event.end_date;
        event.url = _event.url;
        event.region = _event.region;
        event.category = _event.category;
        event.web_tag_groups = _event.web_tag_groups;
        event.date_type = (_event.date_type === 'Да');
        event.has_eticket = (_event.has_eticket === 'Да');
        event.min_price = _event.min_price;
        event.max_price = _event.max_price;
        event.image = _event.image;
        event.age = _event.age;
        event.save();
        i++;
        bar.update(i);
    }));
    bar.stop();
//            log('Parse something here (comment this in cron/index.js or modify cron/parse.js');

};


if (module && module.exports) {
    module.exports = parse;
}