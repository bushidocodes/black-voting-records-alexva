const fs = require('fs');

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
        record.precinct = record["Precinct"];
        delete record["Precinct"];
        record.comments = record["Comments"];
        delete record["Comments"];
    });
    console.log(records);
    writeJSON(records, "/models/cleanedUp.json");
    // fs.writeFileSync(process.cwd() + "/models/cleanedUp.json", JSON.stringify(records));
}

module.exports = {cleanUpJSON};