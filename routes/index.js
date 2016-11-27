const Router = require('express').Router();
const Record = require('../models/record');

Router.route('/')
    .get((req, res, next) => {
        // res.status(200).send("My Man!");
        Record.findAll()
        .then (allRecords => res.json(allRecords))
        .catch(next => console.log(next));
    })

module.exports = Router;