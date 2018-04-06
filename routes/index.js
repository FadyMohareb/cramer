var express = require('express');
var router = express.Router();
var fs = require('fs');
var dir = process.cwd();
var GenoverseInstance = require('../models/GenoverseInstance.js');

/* GET genome page. */
router.get('/', function (req, res, next) {
    GenoverseInstance.find({name: req.query.name}, function (err, instance) {
        if (err) {
            console.log(err);
            req.flash('error', 'Error while finding the instance in the database.');
            res.redirect('/');
        } else if (instance.length) {
            if (fs.existsSync(dir + '/public/javascript/genomes/' + instance[0].genome + '.js')) {
                console.log('Object loaded');
                res.render('index', {object: instance[0]});
            } else {
                console.log('Genome file does not exist');
                req.flash('error', 'Genome file does not exist.');
                res.redirect('/');
            }

        }
    });

});

router.get('/request', function (req, res, next) {

    const {spawn} = require('child_process');

    var requestCorrect = true;

    res.writeHead(200);

    var file = req.query.file,
            chr = req.query.chr,
            start = req.query.start,
            end = req.query.end;

    if (file) {
        if (chr && start && end) {
            var command = req.query.type.match("faidx") ?
                    "/usr/bin/samtools faidx " + file + ' chr' + chr + ':' + start + '-' + end + ' | tail -n+2'
                    : "/usr/bin/tabix " + file + ' chr' + chr + ':' + start + '-' + end;

            const child = spawn("sh", ["-c", command]);

            child.stdout.on('data', function (data) {
                console.log('stdout: ' + data);
            });

            child.stdout.pipe(res);

            child.stderr.on('data', function (data) {
                console.log('stderr: ' + data);
                res.end('stderr: ' + data);
            });

            child.on('close', function (code) {
                console.log('child process exited with code ' + code);
            });
        } else {
            requestCorrect = false;
        }
    } else {
        requestCorrect = false;
    }
    if (!requestCorrect) {
        res.set({"Content-Type": "application/json", "Access-Control-Allow-Origin": "*"}).status(400).send({"error": "Malformed request"});
    }

});

module.exports = router;
