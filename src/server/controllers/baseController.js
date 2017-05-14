var express = require('express');

class BaseController {
    constructor() {
        this.route = express.Router();
    }
}

module.exports = BaseController;