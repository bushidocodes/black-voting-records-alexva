const fs = require('fs');
const Record = require('./record.js');
const db = require('./database');

function readJSON(path) {
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
        .catch((err) => { console.log(`ERROR: ${err}`) })
};

module.exports = { cleanUpJSON, generateDatabase };