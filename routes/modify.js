var express = require('express');
var router = express.Router();
var async = require('async');
var dir = process.cwd();
var path = require('path');
var fs = require('fs');
var GenoverseInstance = require('../models/GenoverseInstance.js');
var utils = require('../routes/utils.js');
var formidable = require('formidable');

router.get('/', utils.IsAuthenticated, function (req, res, next) {
    async.parallel({
        species: function (callback) {
            setTimeout(function () {
                var output = utils.setList(dir + "/public/javascript/genomes/", "list-species.js");
                callback(output[0], output[1]);
            }, 10);
        },
        instance: function (callback) {
            GenoverseInstance.find({name: req.query.name}, function (err, instance) {
                if (err) {
                    throw err;
                } else if (instance.length) {
                    console.log('Instance loaded');
                    callback(null, instance);
                }
            });
        }
    },
            function (err, results) {
                if (err) {
                    req.flash('error', 'Error while loading the species or the instance.');
                    res.redirect('/');
                } else {
                    res.render('modify', {object: results.instance[0], listSpecies: results.species});
                }

            });


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
                GenoverseInstance.find({name: obj.previous}, function (err, instance) {
                    if (err) {
                        res.send(err);
                        throw err;
                    } else if (instance.length) {
                        console.log('Object loaded');
                        instance[0].name = obj.name;
                        instance[0].description = obj.description;
                        instance[0].genome = obj.genome;
                        instance[0].chr = obj.chromosome;
                        instance[0].start = obj.start;
                        instance[0].end = obj.end;
                        instance[0].plugins = obj.plugins;
                        instance[0].tracks = obj.tracks;
                        instance[0].save(function (err) {
                            if (err) {
                                throw err;
                                callback(err);
                            }
                            console.log('Instance modified !');
                            callback(null, true);
                        });
                    }
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
