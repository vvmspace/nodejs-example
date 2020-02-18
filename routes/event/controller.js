const log = require('../../libs/log');
const dateUtil = require('../../libs/date');

class EventController{
    constructor(services){
        this.getEventByUuid = this.getEventByUuid.bind(services);
        this.getEventIndex = this.getEventIndex.bind(services);
    }
    getEventByUuid(request, response, next) {
        const { uuid } = request.params;

        this.models.event.findOne({ uuid })
            .select('-_id, -__v -excluded')
            .populate({
                path: 'venue',
                model: 'venue',
            })
            .then(event => response.json(event))
            .catch(next);
    }
    async getEventIndex(request, response, next) {
        // this.models.event.find({})
        //     // .select('-_id, -__v -excluded')
        //     .then(event => response.json({a:'a'}))
        //     .catch(next);
        const Monday = dateUtil.dayOfWeek(1);
        const Friday = dateUtil.dayOfWeek(5);
        const Sunday = dateUtil.dayOfWeek(7);

        const top = await this.models.event
            .find()
            .populate({
                path: 'venue',
                model: 'venue',
                select: '-events',
            })
            .sort({max_price: -1})
            .limit(24);

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



        response.json({weekly, top, weekends})
    }
}


module.exports = EventController;
