const log = require('../../libs/log');
const dateUtil = require('../../libs/date');
const Friday = dateUtil.dayOfWeek(5);
const Sunday = dateUtil.dayOfWeek(7);


class EventController{
    constructor(services){
        this.getEventByUuid = this.getEventByUuid.bind(services);
        this.getEventIndex = this.getEventIndex.bind(services);
        this.getRock = this.getRock.bind(services);
        this.getRap = this.getRap.bind(services);
        this.getJazz = this.getJazz.bind(services);
        this.getToday = this.getToday.bind(services);
        this.getTomorrow = this.getTomorrow.bind(services);
        this.getWeekly = this.getWeekly.bind(services);
        this.getWeekends = this.getWeekends.bind(services);
        this.getPop = this.getPop.bind(services);
        this.getTop = this.getTop.bind(services);
        this.getTrance = this.getTrance.bind(services);
        this.getHouse = this.getHouse.bind(services);
        this.getElectro = this.getElectro.bind(services);
        this.getAcoustic = this.getAcoustic.bind(services);
        this.getSummer = this.getSummer.bind(services);
        this.getTextRequest = this.getTextRequest.bind(services);
    }

    async getTextRequest(request, response, next) {
        const { uuid } = request.params;
        const _event = await this.models.event
            .findOne({$or: [{uuid}, {alias: uuid}]})
            .populate({
                path: 'venue',
                model: 'venue',
            })
            .catch(e => e);
        const event = _event || {};

        const task_name = `Написать анонс ${event.category.includes('онцерт') && 'концерта ' || ''}  ${event.name} в Москве`;
        const task_text = `
        [B]Задача: Написать анонс ${event.name}[/B][BR]
        Нужна замена текста https://concert.moscow/concert/${event.alias || event.uuid} на уникальный[BR]
        [BR]
        [B]Ключевые слова:[/B][BR]
        ${event.name} в Москве, концерт ${event.name}, ${event.name} в ${event.venue.name}, ${event.name} [дата][BR]
        Проявите фантазию. Смотрите wordstat.yandex.ru и ЦА[BR]
        [BR]
        [B]Целевая аудитория:[/B]
        Потенциальные посетители мероприятия, попадающие на сайт через поиск.[BR]
        [BR]
        [B]Перед выполнением ознакомиться со скриншотом:[/B][BR]
        https://concert.moscow/how_to_write.png[BR]
        [BR]
       [B]Необходимая длина:[/B][BR]
       500 - 1000 знаков без пробелов
        `.replace(/\n/g,'');
        response.json({event, task_text, task_name});
    }

    async getRock(request, response, next) {
        const events = await this.models.event
            .find({$and: [{web_tag_groups: { $regex: '.*Рок.*' }},
                    {date: {$gte: (new Date())}}]})
            .populate({
                path: 'venue',
                model: 'venue',
                select: '-events',
            });
        response.json({events});
    }

    async getRap(request, response, next) {
        const events = await this.models.event
            .find({$and: [{web_tag_groups: { $regex: '.*Рэп,.*'}},
                    {date: {$gte: (new Date())}}]})
            .populate({
                path: 'venue',
                model: 'venue',
                select: '-events',
            });
        response.json({events});
    }

    async getJazz(request, response, next) {
        const events = await this.models.event
            .find({$and: [{web_tag_groups: { $regex: '.*Джаз,.*'}},
                    {date: {$gte: (new Date())}}]})
            .populate({
                path: 'venue',
                model: 'venue',
                select: '-events',
            });
        response.json({events});
    }

    async getPop(request, response, next) {
        const events = await this.models.event
            .find({$and: [{web_tag_groups: { $regex: '.*Поп.*'}},
                    {date: {$gte: (new Date())}}]})
            .populate({
                path: 'venue',
                model: 'venue',
                select: '-events',
            });
        response.json({events});
    }

    async getTop(request, response, next) {
        const events = await this.models.event
            .find({$and: [{min_price: {$gt: 1100}},
                    {category: { $regex: '.*онцерт.*'}},
                    {date: {$gte: (new Date())}}]})
            .sort({ssr: -1, max_price: -1})
            .populate({
                path: 'venue',
                model: 'venue',
                select: '-events',
            }).limit(90);
        response.json({events});
    }

    async getElectro(request, response, next) {
        const events = await this.models.event
            .find({$and: [
                {web_tag_groups: { $regex: '.*Электро,.*'}},
                    {max_price: {$gt: 1000}},
                    {date: {$gte: (new Date())}}
                ]})
            .populate({
                path: 'venue',
                model: 'venue',
                select: '-events',
            });
        response.json({events});
    }

    async getAcoustic(request, response, next) {
        const events = await this.models.event
            .find({$and: [
                    {$or: [{web_tag_groups: { $regex: '.*кустик.*'}}, {name: { $regex: '.*кустик.*'}}]},
                    // {max_price: {$gt: 1000}},
                    {date: {$gte: (new Date())}}
                ]})
            .populate({
                path: 'venue',
                model: 'venue',
                select: '-events',
            });
        response.json({events});
    }

    async getTrance(request, response, next) {
        const events = await this.models.event
            .find({web_tag_groups: { $regex: '.*Транс,.*'}})
            .populate({
                path: 'venue',
                model: 'venue',
                select: '-events',
            });
        response.json({events});
    }

    async getHouse(request, response, next) {
        const events = await this.models.event
            .find({web_tag_groups: { $regex: '.*Хаус,.*'}})
            .populate({
                path: 'venue',
                model: 'venue',
                select: '-events',
            });
        response.json({events});
    }

    getEventByUuid(request, response, next) {
        const { uuid } = request.params;

        this.models.event.findOne({$or: [{ uuid }, {alias : uuid}]})
            .select('-_id, -__v -excluded')
            .populate({
                path: 'venue',
                model: 'venue',
            })
            .then(event => response.json(event))
            .catch(next);
    }

    // Todo: fix dates

    async getToday(request, response, next) {
        const tomorrow = dateUtil.tomorrow();
        const events = await this.models.event
            .find({$and:[{date: {$gte: (new Date())}},
                    {date: {$lt: tomorrow}},
                    {category: { $regex: '.*' + 'ерт' + '.*' }},
                    {min_price: {$gt: 499}}]})
            .populate({
                path: 'venue',
                model: 'venue',
                select: '-events',
            });
        response.json({events});
    }

    async getTomorrow(request, response, next) {
        const tomorrow = dateUtil.tomorrow();
        const events = await this.models.event
            .find({$and:[{date: {$gte: tomorrow}},
                    {date: {$lt: tomorrow.add(1, 'days')}},
                    {category: { $regex: '.*' + 'ерт' + '.*' }},
                    {min_price: {$gt: 499}}]})
            .populate({
                path: 'venue',
                model: 'venue',
                select: '-events',
            });
        response.json({events});
    }

    async getSummer(request, response, next) {
        const tomorrow = dateUtil.tomorrow();
        const events = await this.models.event
            .find({$and:[{date: {$gte: new Date(2020,6,1)}},
                    {date: {$lte: new Date(2020,9,1)}},
                    {category: { $regex: '.*' + 'ерт' + '.*' }},
                    {min_price: {$gt: 499}}]})
            .populate({
                path: 'venue',
                model: 'venue',
                select: '-events',
            });
        response.json({events});
    }

    async getWeekly(request, response, next) {
        const events = await this.models.event
            .find({$and:[{date: {$gte: (new Date())}},
                    {date: {$lt: Sunday}},
                    {category: { $regex: '.*' + 'ерт' + '.*' }},
                    {min_price: {$gt: 899}}]})
            .populate({
                path: 'venue',
                model: 'venue',
                select: '-events',
            })
        response.json({events});
    }



    async getWeekends(request, response, next) {
        const events = await this.models.event
            .find({$and:[{date: {$gte: Friday}},
                    {date: {$lte: Sunday}},
                    {category: { $regex: '.*' + 'ерт' + '.*' }},
                    {min_price: {$gt: 799}}
                ]})
            .populate({
                path: 'venue',
                model: 'venue',
                select: '-events',
            });
        response.json({events});
    }



    async getEventIndex(request, response, next) {

        const top = await this.models.event
            .find()
            .populate({
                path: 'venue',
                model: 'venue',
                select: '-events',
            })
            .sort({max_price: -1})
            .limit(30);

        const ssr = await this.models.event
            .find({ssr: true})
            .populate({
                path: 'venue',
                model: 'venue',
                select: '-events',
            })
            .sort({max_price: -1})
            .limit(30);

        const weekly = await this.models.event
            .find({$and:[{date: {$gte: (new Date())}},
                    {date: {$lt: Sunday}},
                    {category: { $regex: '.*' + 'ерт' + '.*' }},
                    {min_price: {$gt: 899}}]})
            .populate({
                path: 'venue',
                model: 'venue',
                select: '-events',
            })
            .limit(12);

        const weekends = await this.models.event
            .find({$and:[{date: {$gte: Friday}},
                    {date: {$lte: Sunday}},
                    {category: { $regex: '.*' + 'ерт' + '.*' }},
                    {min_price: {$gt: 799}}
                    ]})
            .populate({
                path: 'venue',
                model: 'venue',
                select: '-events',
            })
            .limit(12);



        response.json({ssr, weekly, top, weekends})
    }
}


module.exports = EventController;
