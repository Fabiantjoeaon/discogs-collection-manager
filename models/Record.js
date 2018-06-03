const mongoose = require("mongoose");
mongoose.Promise = global.Promise;
const Record = new mongoose.Schema({
    discogsId: {
        type: Number
    },
    title: {
        type: String
    },
    image: {
        type: String
    },
    year: {
        type: String
    },
    artists: [
        {
            type: String
        }
    ],
    genres: [
        {
            type: String
        }
    ],
    styles: [
        {
            type: String
        }
    ],
    labels: [
        {
            type: String
        }
    ],
    videos: [
        {
            type: String
        }
    ],
    tracks: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Track"
        }
    ],
    discogsCollection: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "DiscogsCollection"
    },
    note: {
        type: String
    }
});

module.exports = mongoose.model("Record", Record);
