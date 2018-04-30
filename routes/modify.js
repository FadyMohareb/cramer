var express = require('express');
var router = express.Router();
var async = require('async');
var dir = process.cwd();
var path = require('path');
var fs = require('fs');
var GenoverseInstance = require('../models/GenoverseInstance.js');
var utils = require('../routes/utils.js');

// Get to open the modify page
router.get('/', utils.IsAuthenticated, function (req, res, next) {
    
    // Perform functions at the same time
    async.parallel({
        // Find the species from the file list species
        species: function (callback) {
            setTimeout(function () {
                var output = utils.setList(dir + "/public/javascript/", "list-species.js");
                callback(output[0], output[1]);
            }, 10);
        },
        
        // Find the genome from the folder genomes
        genomes: function (callback) {
            setTimeout(function () {
                var output = utils.getGenomes();
                callback(output[0], output[1]);
            }, 10);
        },
        
        // Find the instances from the database
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
                    // No error open the page
                    res.render('modify', {object: results.instance[0], listGenomes: results.genomes, listSpecies: results.species});
                }

            });


});

// Post to save the modified instance
router.post('/', function (req, res, next) {
    // Get the json object
    console.log('body: ' + JSON.stringify(req.body));
    var obj = req.body;

    // Perform functions at the same time
    async.parallel({
        
        // Check if it is upload genome, ensembl genome or genome from folder
        valideGenome: function (callback) {
            setTimeout(function () {
                if (obj.genome.type === "ensembl") {
                    var genome = obj.genome.name;
                    console.log('Genome From Ensembl');
                    var output = utils.createGenome(genome);
                    callback(output[0], output[1]);
                } else if (obj.genome.type === "list") {
                    console.log("Genome File From List");
                    callback(null, true);
                } else if (obj.file) {
                    file = obj.file;
                    console.log("Genome From Upload File");
                    var output = utils.createGenomeFromFile(file.filename, file.content);
                    callback(output[0], output[1]);
                } else {
                    console.log("No genome loaded error");
                    callback("No genome loaded", false);
                }
            }, 10);
        },
        
        // Check if instance name is good and save it
        valideConfig: function (callback) {
            setTimeout(function () {
                GenoverseInstance.find({name: obj.name}, function (err, exist) {
                            console.log("Check the name already exist" + exist.length);
                            if (err) {
                                callback(err, null);
                            } else if (exist.length & obj.name !== obj.previous) {
                                console.log("Instance Name Already Exist" + exist.length);
                                callback("Name already exist", null);
                            } else {
                                GenoverseInstance.find({name: obj.previous}, function (err, instance) {
                                    if (err) {
                                        callback(err, null);
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
                                                console.log(err);
                                                throw err;
                                                callback(err);
                                            }
                                            console.log('Instance modified !');
                                            callback(null, true);
                                        });
                                    }
                                });
                            }
                        });

            }, 10);
        }
    },
            function (err, results) {
                if (err) {
                    console.log(err);
                    if (err === "Name already exist") {
                        res.end('name');
                    } else {
                        res.end('error');
                    }

                } else if (results.valideConfig && results.valideGenome) {
                    console.log('Everything is alright');
                    res.end('done');
                } else {
                    console.log('Something is wrong -> Check the validGenome and valideConfig functions');
                    res.end('error');
                }
            }
    );

});

module.exports = router;
