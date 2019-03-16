const express = require('express');
const errors = require('./errors.json');
const config = require('./config.json');
const logger = require('./utils/logger');

const usersRouter = require('./routes/users');
const bankRouter = require('./routes/bank');

const app = express();

// route parsing
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// route handling
app.use('/users', usersRouter);
app.use('/bank', bankRouter);

// unknown route
app.use((_, res) => res.status(404).json(errors.UNKNOWN_ROUTE));

app.use((err, req, res, next ) => {
    if (!err) err = {};

    logger.error('An error occurred on ' + req.method + ' ' + req.url, err);

    if (res.headersSent) return next(err);
    const status = parseInt(err.status || err.code) || 500;

    res.status(status >= 400 && status < 600 ? status : 422).json({
        err: config.ENVIRONMENT === 'development' ? err : status === 500 ? errors.INTERNAL_ERROR.message : errors.UNPROCESSABLE_ENTITY.message
    });
});

module.exports = app;
