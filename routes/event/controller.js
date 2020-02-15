const log = require('../../libs/log');

class EventController{
    constructor(services){
        this.getEventByUuid = this.getEventByUuid.bind(services);
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
}


module.exports = EventController;
