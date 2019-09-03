var mongoose = require('mongoose');



// uncomment for Mac docker (Apparently MacOS Docker immulator assigns this IP address to the Docker Mongo instance!
//var url = "mongodb://172.17.0.2:27017/genoverse";

var url = "mongodb://localhost:27017/genoverse";

module.exports = {
    init: function () {
        mongoose.connect(process.env.MONGODB_URL);
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
