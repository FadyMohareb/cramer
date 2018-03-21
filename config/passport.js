var passport = require('passport');
var localStrategy = require('passport-local').Strategy;
var flash = require('connect-flash');
var User = require('../models/User.js');

module.exports = {
    init: function (app) {

        // Initialize Passport.
        app.use(flash());
        app.use(passport.initialize());
        // Persistent login sessions.
        app.use(passport.session());

        // Configure flash. Requires cookie parser and session.
        app.use(flash());
        app.use(function (req, res, next) {
            res.locals.message = req.flash();
            next();
        });

        // Passport session setup
        passport.serializeUser(function (user, done) {
            done(null, user._id);
        });

        passport.deserializeUser(function (id, done) {
            User.findById(id, function (err, user) {
                done(err, user);
            });
        });

        // Use the LocalStrategy within Passport to login users
        passport.use('local-login', new localStrategy({
            passReqToCallback: true,
            usernameField: 'email'
        },
                function (req, email, password, done) {
                    User.getAuthenticated(email, password, function (err, user) {
                        // In case of any error, return using the done method
                        if (err)
                            throw err;

                        // login was successful if we have a user
                        if (user) {
                            // handle login success
                            console.log('login success');
                            return done(null, user);
                        } else {
                            return done(null, false,
                                    req.flash('error', 'Incorrect Email and Password.'));
                        }

                    });
                }));

    }
};