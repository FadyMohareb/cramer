var express = require('express');
var router = express.Router();
var fs = require('fs');
var dir = process.cwd();
var GenoverseInstance = require('../models/GenoverseInstance.js');
var utils = require('../routes/utils.js');

/* GET genome page. */
router.get('/', function (req, res, next) {
    
    // Find the instance from the name in the url and check if the genome file is correct
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

// Get request to extract data for the tracks
router.get('/request', function (req, res, next) {

    // Variables
    const {spawn} = require('child_process');
    var sync = require('child_process').execSync;
    var requestCorrect = true;
    res.writeHead(200);
    
    // Get the inputs from the url
    var file = req.query.file,
            chr = req.query.chr,
            start = req.query.start,
            end = req.query.end;

    // Check if inputs are not empty
    if (file) {
        if (chr && start && end) {
            var command;
            // Find which command line to execute with the type
            if (req.query.type.match("faidx")) {
                // Write the command
                command = "/usr/local/bin/samtools faidx " + file + ' ' + chr + ':' + start + '-' + end + ' | tail -n+2';
            } 
            else if (req.query.type.match("tabix")) {
                // Find the header
                var listSequenceName = sync('tabix -l ' + file, {cwd: dir + "/indexes"}).toString().split('\n');
                var sequenceName = utils.extractHead(listSequenceName, chr); // Remove "SN:"
                // Write the command
                command = "/usr/local/tabix " + file + ' ' + sequenceName + ':' + start + '-' + end;
            } 
            else if (req.query.type.match("bam")) {
                // Find the header
                var listSequenceName = sync('samtools view -H ' + file + '| grep \'@SQ\' | awk \'{for (i=1;i<=NF;i++){if ($i ~/^SN:/) {print $i}}}\'', {cwd: dir + "/indexes"}).toString().split('\n');
                var sequenceName = utils.extractHead(listSequenceName, chr).substring(3); // Remove "SN:"
                // Write the command
                command = "/usr/bin/samtools view " + file + ' ' + sequenceName + ':' + start + '-' + end;
            } 
            else if (req.query.type.match("bigwig")) {
                // Find the header
                var listSequenceName = sync('/usr/local/bin/kentUtils/bigWigInfo ' + file + ' -chroms | grep SN', {cwd: dir + "/indexes"}).toString().split('\n');
                var sequenceName = utils.extractHead(listSequenceName, chr).substring(3); // Remove "SN:"
                // Write the command
                command = "echo '" + sequenceName + "\t" + start + "\t" + end + "' > position.bed | bwtool extract bed position.bed " + file + " stdout";
            } 
            else if (req.query.type.match("rsem")) {
                // Write the command
                command = "wget -qO- " + file;
            }
            console.log('Command: ' + command);

            // Execute the command line
            const child = spawn("sh", ["-c", command], {cwd: dir + "/indexes"});
            
            child.stdout.on('data', function (data) {
//                console.log('stdout: ' + data);
            });
            child.stdout.pipe(res); // Send the result if no error
            
            // Print the error
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
