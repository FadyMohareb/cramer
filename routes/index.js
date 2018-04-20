var express = require('express');
var router = express.Router();
var fs = require('fs');
var dir = process.cwd();
var GenoverseInstance = require('../models/GenoverseInstance.js');
var utils = require('../routes/utils.js');

/* GET genome page. */
router.get('/', function (req, res, next) {
    GenoverseInstance.find({name: req.query.name}, function (err, instance) {
        if (err) {
            console.log(err);
            req.flash('error', 'Error while finding the instance in the database.');
            res.redirect('/');
        } else if (instance.length) {
            console.log('Object loaded: SUCCESS');
            var filepath = dir + '/public/javascript/genomes/' + instance[0].genome.name + '.js';
            if (!fs.existsSync(filepath)) {
                console.log('Genome File : ERROR -> it does not exist');
                req.flash('error', 'Genome file does not exist.');
                res.redirect('/');
            } else if (utils.checkContentGenome(filepath)) {
                console.log('Genome File : ERROR -> wrong content in the file');
                req.flash('error', 'Wrong content in the genome file.');
                res.redirect('/');
            } else {
                console.log("Genome File: SUCCESS");
                res.render('index', {object: instance[0]});
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
            var command;
            if (req.query.type.match("faidx")) {
                command = "/usr/bin/samtools faidx " + file + ' chr' + chr + ':' + start + '-' + end + ' | tail -n+2';
            } else if (req.query.type.match("tabix")) {
                command = "/usr/bin/tabix " + file + ' chr' + chr + ':' + start + '-' + end;
            } else if (req.query.type.match("bam")) {
                command = "/usr/bin/samtools view " + file + ' ' + chr + ':' + start + '-' + end;
            } else if (req.query.type.match("bigwig")) {
                command = "echo '" + chr + "\t" + start + "\t" + end + "' > position.bed | bwtool extract bed position.bed " + file + " stdout";
            }
            console.log('Command: ' + command);

            const child = spawn("sh", ["-c", command], {cwd: dir + "/indexes"});
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
