`use strict`
var models = require('./models');

const request = require('request');
const express = require('express');
const morgan = require('morgan');
const db = require('./models/database');
const routes = require('./routes');

const app = express();

app.use(morgan("default"));
app.use('/', routes);

let [nodeBin, appEntryPoint, ...args] = process.argv;
// console.log(`process.argv contains ${process.argv[2]}`);
console.log(`process.argv contains ${args}`);

if (args.includes("cacheAndGeocode")) {
    console.log("caching Locations and running geocoding via Google APIs");
    models.generateLocationCache();
    
} else if (args.includes("force")) {
    console.log("FORCE DETECTED: Blowing away DB, rebuilding, and serving");
    models.cleanUpJSON()
        .then(models.generateDatabase)
        .then(function () {
            app.listen(8080, () => {
                console.log('Express server listening on port 8080');
            })
        })
        .catch(function (err) {
            console.error('Problem starting the app')
            console.error(err);
        });
} else {
    console.log("NO FORCE: Serving existing DB");
    db.sync()
        .then(function () {
            app.listen(8080, () => {
                console.log('Express server listening on port 8080');
            })
        })
        .catch(function (err) {
            console.error('Problem starting the app')
            console.error(err);
        });
}



// TODO: Create better system for running desired logic via optional arguments
// models.cleanUpJSON();
// models.generateDatabase();
