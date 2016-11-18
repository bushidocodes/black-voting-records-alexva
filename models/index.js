const fs = require('fs');
var Sequelize = require('sequelize');
var db = new Sequelize('postgres://localhost:5432/black-voting-records-alexva', {
	// logging: false
});

var Record = db.define('page', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    firstName: {
        type: Sequelize.STRING,
        allowNull: false
    },
    lastName: {
        type: Sequelize.STRING,
        allowNull: false
    },
    birthDate: {
        type: Sequelize.DATE,
        allowNull: false
    },
    occupation: {
        type: Sequelize.STRING,
        allowNull: false
    },
    address: {
        type: Sequelize.STRING,
        allowNull: false
    },
    registrationDate: {
        type: Sequelize.DATE,
        allowNull: false
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
},
    {
        classMethods: {
            findByTag: function (tagsArray) {
                return Page.findAll({
                    where: {
                        tags: {
                            $overlap: tagsArray
                        }
                    }
                })
            }
        },
        getterMethods: {
            fullUrl: function () {
                return prefix + this.urlTitle;
            },
            renderedContent: function () {
                return marked(this.content);
            }
        }
    }
)



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
        record.firstName = record["First Name"];
        delete record["First Name"];
        record.lastName = record["Last Name"];
        delete record["Last Name"];
        record.birthDate = new Date(record["Birthdate"]);
        delete record["Birthdate"];
        record.occupation = record["Occupation"];
        delete record["Occupation"];
        record.address = record["Address"];
        delete record["Address"];
        record.registrationDate = new Date(record["Registration Date"]);

        delete record["Registration Date"];
        if (record.registrationDate.getFullYear() > 1970) {
            record.registrationDate.setFullYear(record.registrationDate.getFullYear() - 100);
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

}

module.exports = { cleanUpJSON };