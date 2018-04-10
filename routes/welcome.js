var express = require('express');
var router = express.Router();
var GenoverseInstance = require('../models/GenoverseInstance.js');
var User = require('../models/User.js');
var utils = require('../routes/utils.js');

/* GET genome page. */
router.get('/', function (req, res, next) {

    GenoverseInstance.find(null, function (err, genoverseInstances) {
        if (err) {
            console.log(err);
            req.flash('error', 'Error while parsing the database.');
            res.redirect('/');
        } else if (genoverseInstances.length) {
            console.log('List of instances loaded');
            res.render('welcome', {user: req.user, listInstances: genoverseInstances});
        } else {
            console.log('No instance available');
            res.render('welcome', {user: req.user});
        }
    });
});

router.get('/logout', function (req, res, next) {
    req.logout();
    console.log('Log out');
    res.redirect('/');
});

router.get('/delete/:name', function (req, res, next) {
    GenoverseInstance.remove({name: req.params.name}, function(){
        console.log(req.params.name + 'has been deleted');
    res.redirect('/');
    });
});

module.exports = router;