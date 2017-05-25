var BaseController = require('./baseController');

class HomeController extends BaseController {
    constructor() {
        super();

        this.route.get('/', Index);
    }
}

function Index(req, res) {
    res.sendFile(path.join(__dirname,'../public','index.html'));
}

module.exports = HomeController;