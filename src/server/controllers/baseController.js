var express = require('express');

/**
 * Base controller class
 */
class BaseController {
    /**
     * Acquire Express router
     */
    constructor() {
        this.route = express.Router();
    }
}

module.exports = BaseController;