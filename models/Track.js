const mongoose = require("mongoose");
mongoose.Promise = global.Promise;
const Track = new mongoose.Schema({
    duration: {
        type: String
    },
    position: {
        type: String
    },
    title: {
        type: String
    },
    key: {
        type: String
    },
    bpm: {
        type: String
    },
    energyLevel: {
        type: String
    },
    record: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Record"
    }
});

module.exports = mongoose.model("Track", Track);
