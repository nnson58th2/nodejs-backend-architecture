const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');
const compression = require('compression');

const Routes = require('./routes');

require('dotenv').config();

const app = express();

// Init Middlewares
app.use(morgan('dev'));
app.use(helmet());
app.use(compression());
app.use(express.json());
app.use(
    express.urlencoded({
        extended: true,
    })
);

// Init DB
require('./dbs/init.mongodb');

// Init routes
app.use('/', Routes);

// Handling error

module.exports = app;
