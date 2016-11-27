const fs = require('fs');
const Promise = require('bluebird');
const rp = require('request-promise');
const Record = require('./record.js');
const db = require('./database');
const keys = require('../keys.js');

function readJSON(path) {
    try {
        fs.accessSync(path);
    } catch (err) {
        if (err.code === "ENOENT") {
            console.error(path + ' does not exist. Building as empty object');
            fs.writeFileSync(path, "{}", { flag: 'wx' });
        } else {
            console.log(err);
        }
    }
    let buffer = fs.readFileSync(path);
    return JSON.parse(buffer.toString());
}

function writeJSON(obj, path) {
    fs.writeFileSync(process.cwd() + path, JSON.stringify(obj));
}

function cleanUpJSON() {
    return new Promise(function (resolve, reject) {
        try {
            let records = readJSON('./models/records.json');
            records.map((record) => {
                record.firstname = record["First Name"];
                delete record["First Name"];
                let fnArr = record.firstname.split(" ");
                let titles = ['Mrs', 'Rev', 'Dr', 'Miss'];
                let suffixes = ['Sr', 'Jr', 'III'];
                for (let wordIndex = 0, numWords = fnArr.length; wordIndex < numWords; wordIndex++) {
                    titles.forEach((title) => {
                        if (fnArr[wordIndex] === title) {
                            record.title = title;
                            fnArr.splice(wordIndex, 1);
                        };
                    });
                    suffixes.forEach((suffix) => {
                        if (fnArr[wordIndex] === suffix) {
                            record.suffix = suffix;
                            fnArr.splice(wordIndex, 1);
                        };
                    });
                    if (fnArr[wordIndex] === '?') {
                        fnArr.splice(wordIndex, 1);
                    }

                };
                record.firstname = fnArr.shift();
                record.middlename = (fnArr.length === 0) ? null : fnArr.join(" ");

                if (record.firstname === '-----' || record.firstname === '---') record.firstname = null;

                record.lastname = record["Last Name"];
                delete record["Last Name"];

                record.birthdate = new Date(record["Birthdate"]);
                delete record["Birthdate"];

                record.occupation = (record["Occupation"] === "---") ? null : record["Occupation"];
                delete record["Occupation"];

                record.address = record["Address"];
                delete record["Address"];

                if (record.address === '---' || record.address === '---' || record.address === '--' || record.address === 'not shown' || record.address === 'city' || record.address === '???' || record.address === 'City') {
                    record.address = null;
                }

                record.registrationdate = new Date(record["Registration Date"]);
                delete record["Registration Date"];
                if (record.registrationdate.getFullYear() > 1970) {
                    record.registrationdate.setFullYear(record.registrationdate.getFullYear() - 100);
                }
                record.ward = record["Ward"];
                delete record["Ward"];
                if (record.ward === "") record.ward = null;

                record.precinct = record["Precinct"];
                delete record["Precinct"];
                if (record.precinct === "") record.precinct = null;

                record.comments = record["Comments"];
                delete record["Comments"];
                if (record.comments === "") record.comments = null;
            });
            writeJSON(records, "/models/cleanedUp.json");
            resolve(records);

        } catch (error) {
            reject(error);
        }
    });
};

function generateDatabase() {
    return db.sync({ force: true })
        .then((val) => {
            return readJSON('./models/cleanedUp.json');
        })
        .then((records) => {
            Record.bulkCreate(records);
        })
        .then(() => { console.log("All done") })
        .catch((err) => { console.log(`ERROR: ${err}`) });
};



function generateLocationCache() {
    // Load the location cache
    const locationCache = readJSON('./models/locationCache.json')
    // Check records to see if there are any new records with a loation that must be added to the cache
    const records = readJSON('./models/cleanedUp.json');
    records.forEach(record => {
        // Each record may contain multiple addresses delimited by comma. Check for this and add each to cache
        if (record.address && record.address.includes(",")) {
            let multiAddress = record.address.split(",");
            multiAddress.forEach((address) => {
                let cleanAddress = address.trimLeft().trimRight();
                if (locationCache[cleanAddress] === undefined) locationCache[cleanAddress] = null;
            });
        } else {
            if (record.address && locationCache[record.address] === undefined) locationCache[record.address] = null;
        }
    });
    // Find all address keys with a value of null (have not yet been geocoded) and build a batch of 10 to geocode in parallel.
    let locationCacheKeys = Object.keys(locationCache);
    let nullKeys = locationCacheKeys.filter((currentkey) => {
        return (locationCache[currentkey] === null) ? true : false;
    });
    let batchOfTen = nullKeys.slice(0, 10);
    // Use Array.map and Promise.all to geocode the batch of 10.
    let _getSingleResponse = function (currentKey) {
        let uri = 'https://maps.googleapis.com/maps/api/geocode/json?address=' + (currentKey).replace(' ', '+') + ",+Alexandria,+VA&key=" + keys.mapsKey;
        return rp(uri, function (error, response, body) {
            if (!error && response && response.statusCode == 200) {
                locationCache[currentKey] = JSON.parse(body);
            } else {
                if (response) console.log("Recieved status error of " + response.statusCode);
                console.log(error);
            }
        })
    };
    let getAllResponses = batchOfTen.map(_getSingleResponse);
    Promise.all(getAllResponses)
        // Output the location cache to the console and save to /models/locationCache.json
        .then(() => {
            console.log(locationCache);
            writeJSON(locationCache, "/models/locationCache.json");
            //if successful, check to see if we need to recurse
            let locationCacheKeys = Object.keys(locationCache);
            let nullKeys = locationCacheKeys.filter((currentkey) => {
                return (locationCache[currentkey] === null) ? true : false;
            });
            if (nullKeys.length > 0) {
                console.log(nullKeys.length + " remaining");
                generateLocationCache();
            } else {
                console.log("All done!");
            }

        })
        .catch((err) => { console.log(err); });
};

module.exports = { cleanUpJSON, generateDatabase, generateLocationCache };