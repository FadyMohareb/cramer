var mongoose = require('mongoose');

var url = "mongodb://138.250.31.99:27017/genoverse";

module.exports = {
    init: function () {
        mongoose.connect(url);
        var db = mongoose.connection;
        db.on('error', function (err) {
            if (err) {
                console.log('Connection to the database failed', err);
            } else {
                console.log('Connection to the database success');
            }
        });

        db.once('open', function () {
            console.log('MongoDB connection open');
        });

    }
};
