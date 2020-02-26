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
    await eventSchema.update({alias: 'gruppa-kino'}, {$set: {ssr: true, alias: 'kino', description:
            `<p>7 октября 2010 в СК Олимпийский состоялся концерт <strong>20 лет без Кино</strong>. Я, как посетитель, хочу сказать, что это было не забываемо.</p>
<div style="position: relative; padding-bottom: 56.25%; padding-top: 25px; height: 0;">
<iframe width="560" height="315" src="https://www.youtube.com/embed/5h8y8NR0YqU" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen style="position: absolute; top: 0; left: 0; width: 100%; height: 100%;">
</iframe>
</div>
<p>Отдельно запомнилось исполнение Земфирой песни "Попробуй спеть вместе со мной" при выключенных экранах.</p>
<p>С этого момента прошло 10 лет. Время летит не заметно.</p>
<p>Предстоящий концерт можно было назвать <strong>30 лет без Кино</strong>, но это не официальное название.</p>
<p>В этом году концерт состоится 21 ноября на площадке ВТБ Арена и обещает быть ещё более потрясающим.</p>
<p>Организаторы концерта поставили перед собой задачу проэкспериментировать и показать концепцию концерта группы Кино в 2020 году.</p>
<p>Главной фишкой концерта станет настоящий голос Виктора Цоя, который был собран, оцифрован и обработан при помощи современных технологий (подоздеваю, что не обошлось без нейронных сетей) с многоканальных записей группы Кино.</p>
<p>В отличии от 20 лет без Кино - 30 лет без Кино будет совсем другим. Исполнять песни Цоя будет сам Виктор. А играть музыку будут 2 басиста, которые в разные годы играли в группе: Игорь Тихомиров и Александр Титов, а так же прошедший всю историю и ставший вторым лицом группы Юрий Каспарян.</p>
<p>Концерт Кино будет длиться 2 часа и будет оформлен особым видеорядом, содержащий как историческое олицетворение Виктора Цоя, так и документальной историей группы.</p>
<p>Рекомендую купить билеты прямо сейчас, пока они ещё есть.</p>`}});
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
