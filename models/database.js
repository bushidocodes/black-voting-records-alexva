'use strict';

const Sequelize = require('sequelize');

module.exports = new Sequelize('postgres://localhost:5432/black-voting-records-alexva');

// var db = new Sequelize('postgres://localhost:5432/black-voting-records-alexva');
// var db = new Sequelize('black-voting-records-alexva', null, null, {host: 'localhost', dialect: 'postgres', native: true, logging: false});