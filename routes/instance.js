var express = require('express');
var router = express.Router();
var dir = process.cwd();
var fs = require('fs');

/* GET users listing. */
router.get('/', function (req, res, next) {
    res.render('instance');
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
        createGenome(obj);
        valideGenome = fs.existsSync(dir + '/public/javascript/genomes/' + 'human' + '.js');
    } else {
        console.log('Genome File Already Exists');
    }

    var valideConfig = writeConfig(obj);
    callback(valideConfig, valideGenome);
}


function writeConfig(obj) {
    console.log('Write the config file');

    try {
        var parameters = fs.readFileSync(dir + "/public/javascript/config/config-genoverse-template.js", "utf8")
                .replace(/__CHROM__/, obj.chromosome)
                .replace(/__START__/, obj.start)
                .replace(/__END__/, obj.end)
                .replace(/__PLUGINS__/, JSON.stringify(obj.plugins));

        fs.writeFile(dir + "/public/javascript/config/config-genoverse.js", parameters, "utf8", function () {
            console.log("Config File Done");
        });
        return true;
    } catch (e) {
        console.log("Error writing the config file \n" + e.message);
        return false;
    }

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
                require('fs').writeFile(dir + '/public/javascript/genomes/list-species.js', 'Species = ' + JSON.stringify(JSON.parse(str).species.map(function (d) {
                    return [
                        d.name, {
                            display_name: d.display_name
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

module.exports = router;