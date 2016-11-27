const Router = require('express').Router();
const Record = require('../models/record');
const Models = require('../models');

Router.route('/json')
    .get((req, res, next) => {
        // res.status(200).send("My Man!");
        Record.findAll()
            .then((allRecords) => {
                var resultRecords = [];
                // let resultObj = {};
                // resultObj.records = allRecords;
                let locations = Models.readJSON(__dirname + '/../models/locationCache.json');
                console.log("locations is " + locations);
                allRecords.forEach((record) => {
                    if (locations[record.address]) {
                        record.dataValues.latLng = locations[record.address].results[0].geometry.location;
                        resultRecords.push(record);
                    } else {
                        record.dataValues.latLng = null;
                        resultRecords.push(record);
                    }
                });
                console.log(resultRecords);
                return resultRecords;
            })
            .then((resultRecords) => res.json(resultRecords))
            .catch(next => console.log(next));
    })

Router.get('/', function(req, res, next) {

//   var findingHotels = Hotel.findAll({
//     include: [Place]
//   });

//   var findingActivities = Activity.findAll({
//     include: [Place]
//   });

//   var findingRestaurants = Restaurant.findAll({
//     include: [Place]
//   });

//   Promise.all([
//     findingHotels,
//     findingActivities,
//     findingRestaurants
//   ])
//   .spread(function(hotels, activities, restaurants) {
    res.render('index', {
      hotels: null,
      activities: null,
      restaurants: null
    });
//   })
//   .catch(next);

});

module.exports = Router;