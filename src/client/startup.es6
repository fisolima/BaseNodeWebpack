require('bootstrap/dist/css/bootstrap.css');
window.jQuery = window.$ =  require('jquery/dist/jquery.js');
require('bootstrap/dist/js/bootstrap.min.js');
require('./css/font-awesome.css');
require('./css/main.css');

import {App} from './app';

const app = new App(/*your injections here*/);

app.Startup();