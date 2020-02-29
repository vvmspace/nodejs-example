// Simple example of cron task

const {promises:fs} = require('fs');
const path = require('path');
const parser = require('fast-xml-parser');
const {exec} = require('node-exec-promise');
const cliProgress = require('cli-progress');
const bar = new cliProgress.SingleBar({});

const log = require('../libs/log');

const url = 'https://ponominalu.ru/xml/partner_events_feed_export.xml';
const tmpdir = path.join(__dirname + '/../tmp');
const filename = `${tmpdir}/partner_events_feed_export.xml`;
const eventSchema = require('../models/event');
const venueSchema = require('../models/venue');
const Entities = require('html-entities').XmlEntities;
const entities = new Entities();

const parse = () => {
    exec(`wget ${url} -O ${filename}`)
        .then(async () => {
            await parse_xml();
            require('../libs/mongoose').disconnect();
        })
        .catch(e => log(e));
};

const parse_xml = async () => {

    // const obj = parser.parse();
    const xml = await fs.readFile(filename,  "utf8");
    const obj = parser.parse(xml);
    const events = obj.event_for_export_list.event_for_export_row;
    bar.start(events.length, 0);
    let _event;
    // const aliasesd = ['fedde-le-grand', 'matrang', 'og-buda', 'umaturman', 'agutin-leonid'];
    // aliasesd.map(async alias => await eventSchema.update({alias}, {$set: {
    //     ref_code: 'concertmoscowd'
    //     }}));
    // const aliasest = ['ddt'];
    // aliasest.map(async alias => await eventSchema.update({alias}, {$set: {
    //     ref_code: 'concertmoscowt'
    //     }}));
    // const aliasesv = ['kino'];
    // aliasesv.map(async alias => await eventSchema.update({alias}, {$set: {
    //     ref_code: 'concertmoscowv'
    //     }}));
    await eventSchema.update({alias: 'scooter'}, {$set: {ssr: true, ref_code: 'concertmoscowc',
            description:
            `<p><span>Немецкая музыкальная <strong>группа Scooter</strong> в рамках концертного тура посетит Россию, и выступит для <strong>в Москве</strong> для поклонников <strong>14 марта 2020 года</strong>.</span></p> <p></p> <p><span>Создание коллектива датировано 1993 годом. С того времени музыканты стремительно взобрались на Олимп славы, и не покидают его по сей день. Каждый поклонник мечтает попасть на <strong>концерт Scooter</strong>. С момента основания группы была продано более 35 млн. альбомов, а также завоевано масса премий. Хиты занимают первые строчки во всех чартах как в Германии, так и в других странах.</span></p> <p></p> <p><span>Бессменным фронтменом и лидером коллектива является <strong>Эйч Пи Бакстер</strong>, исполняющие все хиты за более чем 25-летний период существования легендарного трип. Порадует он и московских поклонников на концерте Scooter 13 марта.</span></p> <p></p> <p><span>Последний из хитов группа выпустила в конце прошлого года. Именно в поддержку этой композиции и альбома, в которую она вошла, был запланирован грандиозный тур. В его рамках мы и увидим Scooter в Москве. При этом столицу России германский коллектив посетит даже раньше, чем Великобританию, где также планируется дать несколько концертов. Поэтому не теряйте уникальный шанс насладиться любимой музыкой раньше европейцев, и скорее приобретайте билеты на Scooter в Adrenaline Stadium, пока они еще есть в наличии!</span></p>`}});
    for (let i = 0; i < events.length; i++) {
        _event = events[i];

        let alias = _event.url.split('/event/')[1].split('/')[0];
        const byAlias = await eventSchema.findOne({alias}).catch(e => e);
        if (byAlias && (byAlias.ponominalu_id != _event.id)) {
            const pretty_date = new Date(_event.date).toLocaleString('en', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
                timeZone: 'Europe/Moscow'
            }).toLowerCase().replace(/ /g, "-").replace(',', '');
            alias = `${alias}-${pretty_date}`;
        }
        // log(alias);
        bar.update(i);
        let ev = await eventSchema.findOne({ponominalu_id: _event.id}).catch(e => e);
        if (!ev) {
            log(ev);
            ev = new eventSchema({ponominalu_id: _event.id});
        }
        const event = ev;
        event.ponominalu_id = _event.id;
        if (!event.ssr) {
            event.description = entities.decode(_event.description);
            event.name = entities.decode(_event.title);
            event.title = event.name;
        }
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
        if (!event.alias) {
            event.alias = alias;
        }
        event.updatedAt = new Date();
        await event.save();

        const venue_search = await venueSchema.findOne({$or: [{alias: _event.venue_alias}, {ponominalu_id: _event.venue_id}]}).catch(e => log(e));
        const venue = venue_search || new venueSchema({ponominalu_id: _event.venue_id});
        if (!venue.ssr) {
            venue.name = entities.decode(_event.venue);
            venue.alias = _event.venue_alias;
            venue.address = entities.decode(_event.venue_address);
        }
        venue.ponominalu_id = _event.venue_id;
        await venue.save();

        event.venue = venue._id;
        await event.save();

        if (!venue.events.find(ev => ev.equals(event._id))) {
            venue.events.push(event._id);
            await venue.save();
        }
    }
    bar.stop();
};

module.exports = parse;
if (!module.parent) {
    parse();
}
