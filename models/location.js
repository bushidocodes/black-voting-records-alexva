// 'use strict';

// const Sequelize = require('sequelize');
// const db = require('./database');

// const Location = db.define('location', {
//     id: {
//         type: Sequelize.INTEGER,
//         primaryKey: true,
//         autoIncrement: true
//     },
//     title: {
//         type: Sequelize.STRING,
//         allowNull: true,
//         defaultValue: null
//     },
//     firstname: {
//         type: Sequelize.STRING,
//         allowNull: true,
//         defaultValue: null
//     },
//     middlename: {
//         type: Sequelize.STRING,
//         allowNull: true,
//         defaultValue: null
//     },
//     lastname: {
//         type: Sequelize.STRING,
//         allowNull: false
//     },
//     suffix: {
//         type: Sequelize.STRING,
//         allowNull: true,
//         defaultValue: undefined
//     },
//     birthdate: {
//         type: Sequelize.DATE,
//         allowNull: true
//     },
//     occupation: {
//         type: Sequelize.STRING,
//         allowNull: true,
//         defaultValue: null
//     },
//     address: {
//         type: Sequelize.STRING,
//         allowNull: true
//     },
//     registrationdate: {
//         type: Sequelize.DATE,
//         allowNull: true
//     },
//     ward: {
//         type: Sequelize.INTEGER, //(1, 2, 3, 4),
//         allowNull: false
//     },
//     precinct: {
//         type: Sequelize.ENUM('ARM', 'CITY', 'FIRE', 'FRND', 'LEE', 'ODD', 'SEV'),
//         allowNull: false
//     },
//     comments: {
//         type: Sequelize.TEXT,
//         allowNull: true
//     }
//     // TODO: Add geography value that stores the latlng returned by a geolocation call to Google Maps Geocoding API.
//     // https://developers.google.com/maps/documentation/geocoding/intro
//     // ,
//     // geography: {
//     //     type: Sequelize.
//     // }
// });

// module.exports = Record;