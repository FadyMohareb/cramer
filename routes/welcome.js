var express = require('express');
var router = express.Router();
var GenoverseInstance = require('../models/GenoverseInstance.js');
var User = require('../models/User.js');

/* GET genome page. */
router.get('/', function (req, res, next) {
    GenoverseInstance.find(null, function (err, genoverseInstances) {
        if (err) {
            res.send(err);
            throw err;
        } else if (genoverseInstances.length) {
            console.log('List of instances loaded');

            if (req.user === null) {
                res.render('welcome', {listInstances: genoverseInstances});
            } else {
                res.render('welcome', {user: req.user, listInstances: genoverseInstances});
            }
        } else {
            res.send('No genoverse instances found');
        }

    });
});

router.get('/logout',
    function(req, res, next){
        req.logout();
        console.log('Log out');
        res.redirect('/');
});

module.exports = router;
