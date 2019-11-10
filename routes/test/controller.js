const log = require('../../libs/log');

class TestController{
    constructor(services){
        this.index = this.index.bind(services);
        this.text = this.text.bind(services);
    }
    index(req, res){
        res.json({test: 'index'});
    }
    text(req, res){
        res.json({test: 'text'});
    }
}


module.exports = TestController;
