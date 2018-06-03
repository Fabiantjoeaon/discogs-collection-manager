//TODO:
const mongoose = require("mongoose");

module.exports = mongoose.model(
    "Set",
    new mongoose.Schema({
        name: {
            type: String
        },
        description: {
            type: String
        },
        tracks: [
            {
                order: {
                    type: Number
                },
                track: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "Track"
                }
            }
        ]
    })
);
