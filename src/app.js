const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');
const compression = require('compression');

const app = express();

// Init Middlewares
app.use(morgan('dev'));
app.use(helmet());
app.use(compression());

// Init DB
require('./dbs/init.mongodb');

// Init routes

// Handling error

module.exports = app;
