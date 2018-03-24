var express = require('express');
var router = express.Router();
var async = require('async');
var dir = process.cwd();
var fs = require('fs');
var GenoverseInstance = require('../models/GenoverseInstance.js');

/* GET users listing. */
router.get('/', function (req, res, next) {

    async.parallel({
        species: function (callback) {
            fs.readFile(dir + '/public/javascript/genomes/list-species.json', 'utf8', function (err, data) {
                if (err) {
                    throw err;
                    callback(err);
                }
                callback(null, JSON.parse(data));
            });
        },
        plugins: function (callback) {
            fs.readFile(dir + '/public/javascript/plugins/list-plugins.json', 'utf8', function (err, data) {
                if (err) {
                    throw err;
                    callback(err);
                }
                callback(null, JSON.parse(data));
            });
        }
    },
            function (err, results) {
                // results is now equals to: {one: 1, two: 2}
                res.render('instance', {listSpecies: results.species, listPlugins: results.plugins});
            });


});
router.post('/', function (req, res, next) {

    console.log('body: ' + JSON.stringify(req.body));
    var obj = req.body;
    setUpParameters(obj, function (valideConfig, valideGenome) {
        if (valideConfig && valideGenome) {
            res.end('done');
            console.log('Everything is alright -> Open the index page');
        } else {
            res.end('error');
            console.log('Something is wrong -> Check the createGenome or writeConfig functions');
        }
    });
});
function setUpParameters(obj, callback) {
    var valideGenome = fs.existsSync(dir + '/public/javascript/genomes/' + 'human' + '.js');
    if (!valideGenome) {
        console.log('Genome Does Not Exist Yet');
        createGenome(obj.genome);
        valideGenome = fs.existsSync(dir + '/public/javascript/genomes/' + 'human' + '.js');
    } else {
        console.log('Genome File Already Exists');
    }

    valideConfig = addDatabase(obj);
    callback(valideConfig, valideGenome);
}

function addDatabase(obj) {
    var instance = new GenoverseInstance({
        "name": obj.name,
        "description": obj.description,
        "genome": obj.genome,
        "chr": obj.chr,
        "start": obj.start,
        "end": obj.end,
        "plugins": obj.plugins,
        "tracks": "",
    });
    instance.save(function (err) {
        if (err) {
            throw err;
            return false;
        }
        console.log('Commentaire ajouté avec succès !');
        return true;
    });
}

function createGenome(obj) {
    console.log('Write the genome file');
    // Create a genome file from the Ensembl REST API
    require('http').get({
        hostname: 'rest.ensembl.org',
        path: '/info/assembly/homo_sapiens?bands=1',
        headers: {'Content-Type': 'application/json'}
    }, function (response) {
        var str = '';
        response.on('data', function (chunk) {
            str += chunk;
        });
        response.on('end', function () {
            try {
                require('fs').writeFile(dir + '/public/javascript/genomes/human.js', 'Genoverse.Genomes.' + 'human' + ' = ' + JSON.stringify(JSON.parse(str).top_level_region.filter(function (d) {
                    return d.coord_system === 'chromosome';
                }).map(function (d) {
                    return [
                        d.name, {
                            size: d.length,
                            bands: (d.bands || [{start: 1, end: d.length}]).map(function (b) {
                                return {id: b.id, start: b.start, end: b.end, type: b.stain};
                            })
                        }
                    ];
                }).reduce(function (hash, d) {
                    hash[d[0]] = d[1];
                    return hash;
                }, {}), null, 2), function () {
                    console.log('Genome File Done');
                });
            } catch (e) {
                console.log(e.message);
            }
        });
    }).on('error', function (e) {
        console.log(`Got error: ${e.message}`);
    }).end();
}

function updateSpecies() {
    console.log('Write all the species in a file');
// Create a species file for the Ensembl REST API
    require('http').get({
        hostname: 'rest.ensembl.org',
        path: '/info/species?',
        headers: {'Content-Type': 'application/json'}
    }, function (response) {
        var str = '';
        response.on('data', function (chunk) {
            str += chunk;
        });
        response.on('end', function () {
            try {
                require('fs').writeFile(dir + '/public/javascript/genomes/list-species.json', JSON.stringify(JSON.parse(str).species.map(function (d) {
                    return [
                        d.name, {
                            display_name: d.display_name,
                            id: d.name
                        }
                    ];
                }).reduce(function (hash, d) {
                    hash[d[0]] = d[1];
                    return hash;
                }, {}), null, 2), function () {
                    console.log('Species File Done');
                });
            } catch (e) {
                console.log(e.message);
            }
        });
    }).on('error', function (e) {
        console.log(`Got error: ${e.message}`);
    }).end();
}

module.exports = router;