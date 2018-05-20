const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const DiscogsCollection = new mongoose.Schema({
    username: {
        type: String
    }
});

module.exports = mongoose.model('DiscogsCollection', DiscogsCollection);
