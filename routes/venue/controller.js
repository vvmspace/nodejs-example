const log = require('../../libs/log');

class VenueController{
    constructor(services){
        this.getVenueByUuidOrAlias = this.getVenueByUuidOrAlias.bind(services);
        this.getVenueList = this.getVenueList.bind(services);
    }
    getVenueByUuidOrAlias(request, response, next) {
        const { uuid } = request.params;

        this.models.venue.findOne({$or: [{ uuid },{alias: uuid}]})
            .select('-_id, -__v -excluded')
            .populate({
                path: 'events',
                model: 'event',
            })
            .then(venue => response.json(venue))
            .catch(next);
    }

    getVenueList(request, response, next) {
        this.models.venue.find()
            .select('name address alias uuid -_id ponominalu_id')
            .then(venue => response.json(venue))
            .catch(next);
    }
}


module.exports = VenueController;
