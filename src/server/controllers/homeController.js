var BaseController = require('./baseController');

/**
 * Home controller
 */
class HomeController extends BaseController {
    /**
     * Define access point of main page
     */
    constructor() {
        super();

        this.route.get('/', (req, res) => res.sendFile(path.join(__dirname,'../public','index.html')));

        /**
         * @api {get} /api/sample/:msg Api sample
         * @apiName SampleApi
         * @apiGroup Sample
         *
         * @apiParam {String} request message.
         *
         * @apiSuccess {String} message Request message.
         */
        this.route.get('/api/sample/:msg', (req, res) => {
            res.json({message: req.params.msg})
        });
    }
}

module.exports = HomeController;