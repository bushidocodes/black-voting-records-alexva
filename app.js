`use strict`
const request = require('request'),
express = require('express'),
morgan = require('morgan'),
bodyParser = require('body-parser'),
nunjucks = require('nunjucks'),
path = require('path');

const models = require('./models');
const db = require('./models/database');
const routes = require('./routes');

const app = express();

// nunjucks rendering boilerplate
nunjucks.configure('views', { noCache: true });
app.set('view engine', 'html');
app.engine('html', nunjucks.render);

// logging and body-parsing
app.use(morgan("default"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// statically serve front-end dependencies
app.use('/bootstrap', express.static(path.join(__dirname, '/node_modules/bootstrap/dist')));
app.use('/jquery', express.static(path.join(__dirname, '/node_modules/jquery/dist')));

// serve any other static files
app.use(express.static(path.join(__dirname, '/public')));

// serve dynamic routes
app.use(require('./routes'));

// failed to catch req above means 404, forward to error handler
app.use(function (req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// handle any errors
app.use(function (err, req, res, next) {
  console.error(err, err.stack);
  res.status(err.status || 500);
  res.render('error', {
    error: err
  });
});


// Process arguments and start as instructed
let [nodeBin, appEntryPoint, ...args] = process.argv;
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