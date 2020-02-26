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
    // await eventSchema.update({uuid: '1UI-q6B8k-'}, {$set: {ssr: true, description: '<p><b>Fedde Le Grand</b> выступит <b>8 марта</b> в <b>WOW Dinner Show Restaurant & Club</b>, на вечеринке от проекта <b>«BONFIRE»</b>.</p><p>Культовый DJ исполнит свои лучшие композиции в своем крутом сете. Уже 15 лет Fedde Le Grand радует своих поклонников хитами EDM индустрии. Его хит «Put Your Hands Up For Detroit» принес ему всемирную известность, он пользуется большой популярностью в самых крупных танцевальных мероприятиях мира. У вас есть уникальный шанс услышать его в живую на его выступлении в Москве!</p><p>В рамках мероприятия также выступят:</p><p>Basky — московский диджей и продюсер<p><p>DJ Martinez</p><p>Лайн-ап будет пополняться</p>', alias: 'fedde-le-grand'}});
    await eventSchema.update({alias: 'matrang'}, {$set: {ssr: true, description:
            `<p>Большой <b>сольный концерт Matrang</b>, пройдет <b>в Москве 7 ноября 2020 г. в Adrenaline stadium.</b></p>
<p><b>Matrang</b> - Российский музыкант и исполнитель с уникальным голосом, настоящее имя артиста Алан Хадзарагов, начал свою музыкальную карьеру еще в 2012 году, но большую популярность обрел после выхода его сингла «Медуза» в 2018 году. Многие поклонники его сравнивают с Виктором Цоем из-за его необычного голоса, но как считает сам артист до таких вершин ему еще далеко. У артиста огромное количество песен и композиций среди которых можно выделить самые яркие: «Медуза», «От луны до Марса», «ОМО», «Проснись», «Дурень», «Замыкать», «С самим собой».</p>
<p>Атмосфера таинственности его песен, музыки погружающей в транс, голос Алана и лунная энергия которой певец делится на своих концертах не оставят вас равнодушными.</p>`}});
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
        event.name = entities.decode(_event.title);
        event.title = event.name;
        if (!event.ssr) {
            event.description = entities.decode(_event.description);
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
