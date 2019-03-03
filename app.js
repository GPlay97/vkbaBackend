const express = require('express');
const errors = require('./errors.json');

const usersRouter = require('./routes/users');

const app = express();

// route parsing
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// route handling
app.use('/users', usersRouter);

// unknown route
app.use((_, res) => res.status(404).json(errors.UNKNOWN_ROUTE));

module.exports = app;
