var express = require('express');
var router = express.Router();
var async = require('async');
var dir = process.cwd();
var path = require('path');
var fs = require('fs');
var GenoverseInstance = require('../models/GenoverseInstance.js');
var utils = require('../routes/utils.js');
var formidable = require('formidable');

/* GET users listing. */
router.get('/', utils.IsAuthenticated, function (req, res, next) {
    async.parallel({
        species: function (callback) {
            setTimeout(function () {
                var output = utils.setList(dir + "/public/javascript/genomes/", "list-species.js");
                callback(output[0], output[1]);
            }, 10);
        },
        plugins: function (callback) {
            setTimeout(function () {
                var output = utils.setList(dir + "/public/javascript/plugins/", "list-plugins.js");
                callback(output[0], output[1]);
            }, 10);
        }
    },
            function (err, results) {
                if (err) {
                    console.log(err);
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
                if (obj.genome.type === "ensembl") {
                    var genome = obj.genome.name;
                    var valideGenome = fs.existsSync(dir + '/public/javascript/genomes/' + genome + '.js');
                    if (!valideGenome) {
                        console.log('Genome Does Not Exist Yet');
                        utils.createGenome(genome);
                    } else {
                        console.log('Genome File Already Exists');
                    }
                    callback(null, true);
                } else {
                    console.log("Genome from file");
                    callback(null, true);
                }
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
                    "tracks": obj.tracks
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

router.post('/upload', function (req, res, next) {

    // create an incoming form object
    var form = new formidable.IncomingForm();

    // store all uploads in the /uploads directory
    form.uploadDir = path.join(dir, '/public/javascript/genomes');

    // every time a file has been uploaded successfully,
    // rename it to it's orignal name
    form.on('file', function (field, file) {
        fs.rename(file.path, path.join(form.uploadDir, file.name));
    });

    // log any errors that occur
    form.on('error', function (err) {
        console.log('An error has occured: \n' + err);
    });

    // once all the files have been uploaded, send a response to the client
    form.on('end', function () {
        console.log("Genome copied in genomes folder");
        res.end('success');
    });

    // parse the incoming request containing the form data
    form.parse(req);
});

module.exports = router;