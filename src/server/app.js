var express = require('express');
var path = require('path');
var HomeController = require('./controllers/homeController');

class App {
    constructor(/*your injection here*/) {
        this._express = express();
        this._port = process.env.PORT || 3000;

        RegisterRoutes(this);
    }

    Start() {
        // console.log('App.Start');
        // console.log(path.resolve(__dirname));
        // console.log(process.argv);
        this._express.listen(this._port, () => {
            console.log('listening on ' + this._port);
        });
    }
}

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