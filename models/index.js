const fs = require('fs');
var Sequelize = require('sequelize');
var db = new Sequelize('postgres://localhost:5432/black-voting-records-alexva');

var Record = db.define('record', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    title: {
        type: Sequelize.STRING,
        allowNull: true,
        defaultValue: undefined
    },
    firstname: {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: undefined
    },
    middlename: {
        type: Sequelize.STRING,
        allowNull: true
    },
    lastname: {
        type: Sequelize.STRING,
        allowNull: false
    },
    suffix: {
        type: Sequelize.STRING,
        allowNull: true,
        defaultValue: undefined
    },
    birthdate: {
        type: Sequelize.DATE,
        allowNull: true
    },
    occupation: {
        type: Sequelize.STRING,
        allowNull: false
    },
    address: {
        type: Sequelize.STRING,
        allowNull: true
    },
    registrationdate: {
        type: Sequelize.DATE,
        allowNull: true
    },
    ward: {
        type: Sequelize.INTEGER, //(1, 2, 3, 4),
        allowNull: false
    },
    precinct: {
        type: Sequelize.ENUM('ARM', 'CITY', 'FIRE', 'FRND', 'LEE', 'ODD', 'SEV'),
        allowNull: false
    },
    comments: {
        type: Sequelize.TEXT,
        allowNull: true
    }
    // TODO: Add geography value that stores the latlng returned by a geolocation call to Google Maps Geocoding API.
    // https://developers.google.com/maps/documentation/geocoding/intro
    // ,
    // geography: {
    //     type: Sequelize.
    // }
});

function readJSON(path) {
    var buffer = fs.readFileSync(path);
    return JSON.parse(buffer.toString());
}

function writeJSON(obj, path) {
    // console.log(process.cwd() + path);
    fs.writeFileSync(process.cwd() + path, JSON.stringify(obj));
}

function cleanUpJSON() {
    var records = readJSON('./models/records.json');
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
        record.middlename = fnArr.join(" ");

        record.lastname = record["Last Name"];
        delete record["Last Name"];

        record.birthdate = new Date(record["Birthdate"]);
        delete record["Birthdate"];

        record.occupation = record["Occupation"];
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
    // console.log(records);
    var wards = [];
    var precincts = [];
    var comments = [];

    records.forEach((record) => {
        comments.push(record.comments);
        wards.push(record.ward);
        precincts.push(record.precinct);
    });
    // console.log(precincts)
    // console.log(wards)
    // console.log("Comments:\n", comments.sort().filter(function(el,i,a){if(i==a.indexOf(el))return 1;return 0}));
    // console.log("WARDS:\n", wards.sort().filter(function(el,i,a){if(i==a.indexOf(el))return 1;return 0}));
    // records.filter((record) => {if (record.comments == "FRND" || record.comments == "CITY") console.log(record)});
    // console.log("People with weird WARD values:\n";



    // console.log("PRECINCTS:\n", precincts.sort().filter(function(el,i,a){if(i==a.indexOf(el))return 1;return 0}));
    // console.log("PRECINCTS:\n", precints.filter((value, index, self) => { self.indexOf(value) === index }));
    writeJSON(records, "/models/cleanedUp.json");
    // fs.writeFileSync(process.cwd() + "/models/cleanedUp.json", JSON.stringify(records));
    return records;
};

function generateDatabase() {
    db.sync({ force: true })
        .then((val) => {
            return readJSON('./models/cleanedUp.json');
        })
        .then((records) => {
            Record.bulkCreate(records);
        })
        .then(() => { console.log("All done") })
        .catch((err) => { console.log(`ERROR: ${err}`) })
};

module.exports = { cleanUpJSON, generateDatabase };