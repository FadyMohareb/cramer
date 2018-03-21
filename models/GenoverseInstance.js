var mongoose = require('mongoose');

var GenoverseSchema = new mongoose.Schema({
    name: {type: String, required: true, index: {unique: true}},
    description: {type: String, required: true}
});

module.exports = mongoose.model('GenoverseInstance', GenoverseSchema);

