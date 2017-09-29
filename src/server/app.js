var express = require('express');
var path = require('path');
var HomeController = require('./controllers/homeController');
var config = require('./config.json');

/**
 * Main server application class
 */
class App {
    /** 
     * Initialize Express and controllers
    */
    constructor(/*your injection here*/) {
        this._express = express();
        this._port = process.env.PORT || config.port || 5000;

        RegisterRoutes(this);
    }

    /**
     * Initialize server application.
     * Activate Express listener
     */
    Start() {
        // console.log('App.Start');
        // console.log(path.resolve(__dirname));
        // console.log(process.argv);
        this._express.listen(this._port, () => {
            console.log('listening on ' + this._port);
        });
    }
}

/**
 * Register controllers and public contents
 * @param {express} app 
 */
function RegisterRoutes(app) {
    app._express.use(express.static(path.join(__dirname, "../public")));

    app._express.get('/favicon.ico', (req, res) => {
        res.end();
    });

    const homeController = new HomeController();

    app._express.use(homeController.route);

    app._express.use((req, res, next) => {
        next(new Error('[404] Not Found: ' + req.url));
    });
}

module.exports = App;