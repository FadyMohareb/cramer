var mongoose = require('mongoose');

var url = "mongodb://localhost:27017/todo";

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
