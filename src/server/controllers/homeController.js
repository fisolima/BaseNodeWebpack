var BaseController = require('./baseController');

class HomeController extends BaseController {
    constructor() {
        super();

        this.route.get('/', Index);
    }
}

function Index(req, res) {
    res.end("Home Controller");
}

module.exports = HomeController;