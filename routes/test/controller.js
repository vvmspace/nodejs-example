const log = require('../../libs/log');

class TestController{
    constructor(services){
        this.index = this.index.bind(services);
        this.text = this.text.bind(services);
    }
    index(req, res){
        this.models.notice.find().then(notices => {
            res.json(notices);
        });
        // res.json({test: 'index'});
    }
    text(req, res){
        this.models.notice.create({
            message: (new Date()).toISOString(),
        });
        res.json({test: 'text'});
    }
}


module.exports = TestController;
