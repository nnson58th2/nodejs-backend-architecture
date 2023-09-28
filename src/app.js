const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');
const compression = require('compression');

require('dotenv').config();

const Routes = require('./routes');

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
app.use((req, res, next) => {
    const error = new Error('Not found!');
    error.status = 404;
    next(error);
});

app.use((error, req, res, next) => {
    const statusCode = error.status || 500;
    const message = error.message || 'Internal Server Error!';

    return res.status(statusCode).json({
        code: statusCode,
        stack: error.stack,
        message,
        status: 'error',
    });
});

module.exports = app;
