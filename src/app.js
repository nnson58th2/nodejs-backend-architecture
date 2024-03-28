const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const { v4: uuidv4 } = require('uuid');

require('dotenv').config();

const systemLogger = require('./loggers/system.log');
const Routes = require('./routes');

const app = express();

// Cors
const corsOptions = {
    origin: 'http://localhost:3055',
    method: 'GET,HEAD,POST,PUT,PATCH,DELETE',
    credential: true,
    optionSuccessStatus: 204,
};

app.use(cors(corsOptions));

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

// Log request
app.use((req, res, next) => {
    const requestId = req.headers['x-request-id'];
    req.requestId = requestId || uuidv4();

    systemLogger.log(`Input params::${req.method}`, [
        req.path,
        { requestId: req.requestId },
        req.method === 'POST' || req.method === 'PUT' ? req.body : req.query,
    ]);

    next();
});

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

    const resMessage = `Status Code:${statusCode} - ${Date.now() - error.now}ms - Response: ${JSON.stringify(error)}`;
    systemLogger.error(resMessage, [req.path, { requestId: req.requestId }, { message }]);

    return res.status(statusCode).json({
        code: statusCode,
        stack: error.stack,
        message,
        status: 'error',
    });
});

module.exports = app;
