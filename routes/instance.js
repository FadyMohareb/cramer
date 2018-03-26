var express = require('express');
var router = express.Router();
var async = require('async');
var dir = process.cwd();
var auth = require('../config/authentication.js');
var fs = require('fs');
var GenoverseInstance = require('../models/GenoverseInstance.js');
var utils = require('../routes/utils.js');

/* GET users listing. */
router.get('/', auth.IsAuthenticated, function (req, res, next) {

    async.parallel({
        species: function (callback) {
            setTimeout(function () {
                fs.readFile(dir + '/public/javascript/genomes/list-species.json', 'utf8', function (err, data) {
                    if (err) {
                        throw err;
                        callback(err);
                    }
                    console.log("List species loaded");
                    callback(null, JSON.parse(data));
                });
            }, 10);
        },
        plugins: function (callback) {
            setTimeout(function () {
                fs.readFile(dir + '/public/javascript/plugins/list-plugins.json', 'utf8', function (err, data) {
                    if (err) {
                        throw err;
                        callback(err);
                    }
                    console.log("List plugins loaded");
                    callback(null, JSON.parse(data));
                });
            }, 10);
        },
    },
            function (err, results) {
                if (err) {
                    req.flash('error', 'Error while loading the list plugins or the list species.');
                    res.redirect('/');
                } else {
                    res.render('instance', {listSpecies: results.species, listPlugins: results.plugins});
                }

            }
    );
});

router.post('/', function (req, res, next) {

    console.log('body: ' + JSON.stringify(req.body));
    var obj = req.body;

    async.parallel({
        valideGenome: function (callback) {
            setTimeout(function () {
                var valideGenome = fs.existsSync(dir + '/public/javascript/genomes/' + obj.genome + '.js');
                if (!valideGenome) {
                    console.log('Genome Does Not Exist Yet');
                    utils.createGenome(obj.genome);
                    valideGenome = fs.existsSync(dir + '/public/javascript/genomes/' + obj.genome + '.js');
                } else {
                    console.log('Genome File Already Exists');
                }
                callback(null, true);
            }, 10);
        },
        valideConfig: function (callback) {
            setTimeout(function () {
                var instance = new GenoverseInstance({
                    "name": obj.name,
                    "description": obj.description,
                    "genome": obj.genome,
                    "chr": obj.chromosome,
                    "start": obj.start,
                    "end": obj.end,
                    "plugins": obj.plugins,
                    "tracks": ""
                });
                instance.save(function (err) {
                    if (err) {
                        throw err;
                        callback(err);
                    }
                    console.log('Instance added !');
                    callback(null, true);
                });

            }, 10);
        }
    },
            function (err, results) {
                if (results.valideConfig && results.valideGenome) {
                    res.end('done');
                    console.log('Everything is alright -> Open the index page');
                } else {
                    res.end('error');
                    console.log('Something is wrong -> Check the createGenome or writeConfig functions');
                }
            }
    );

});

module.exports = router;