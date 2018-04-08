var express = require('express');
var router = express.Router();
var async = require('async');
var dir = process.cwd();
var path = require('path');
var fs = require('fs');
var GenoverseInstance = require('../models/GenoverseInstance.js');
var utils = require('../routes/utils.js');

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
                    console.log('Genome From Ensembl');
                    var output = utils.createGenome(genome);
                    callback(output[0], output[1]);
                } else if (obj.file) {
                    file = obj.file;
                    console.log("Genome From File");
                    var output = utils.createGenomeFromFile(file.filename, file.content);
                    callback(output[0], output[1]);
                } else {
                    console.log("Genome Not Changed from File");
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

module.exports = router;
