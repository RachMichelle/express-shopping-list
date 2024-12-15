const express = require('express');
const CustomError = require('./error');
const items = require('./fakeDb');
const routes = require('./routes');

const app = express();

app.use(express.json());

app.use('/items', routes);

app.use((req, res, next) => {
    const e = new CustomError('Not Found', 404);
    return next(e);
})

app.use((err, req, res, next) => {
    res.status(err.status || 500);
    return res.json({ERROR : err.msg})
})

module.exports = app;