var express = require('express');
var router = express.Router();
var passport = require('passport');

/* GET login page. */
router.get('/', function(req, res, next) {
  res.render('login');
});

/**
 * POST login
 */
router.post('/', function(req, res, next) {
    passport.authenticate('local-login', {
        successRedirect: '/',
        failureRedirect: '/login',
        failureFlash : true
    })(req, res, next)
});

module.exports = router;
