const express = require("express");
const mongoose = require("mongoose");
const DiscogsCollection = require("../models/DiscogsCollection");
const Record = require("../models/Record");
const Track = require("../models/Track");
const { catchErrors } = require("../helpers/errorHandlers");
const {
    updateCollection
} = require("../services/fillRecordsFromDiscogsService");
const { listMissingVideos } = require("../services/youtubeListingService");
const {
    getCamelotIndex,
    camelotWheel,
    getKey
} = require("../helpers/camelotWheel");

const router = express.Router();

router.get("/", async (req, res) => {
    const collections = await DiscogsCollection.find();

    return res.render("index", {
        collections
    });
});
router.get("/collections/:username", async (req, res) => {
    const collection = await DiscogsCollection.findOne({
        username: req.params.username
    });
    const records = await Record.find({
        discogsCollection: collection._id
    }).populate({
        path: "tracks",
        select: "position duration title key energyLevel bpm"
    });

    return res.render("collection/index", { collection, records });
});

router.get("/collections/:username/fill", async (req, res) => {
    await updateCollection({ username: req.params.username });
    res.redirect("/");
});
router.get("/collections/:username/list-youtube-videos", async (req, res) => {
    const list = await listMissingVideos({ username: req.params.username });

    res.render("collection/list-youtube-videos", { list });
});

router.get("/record/:id/edit", async (req, res) => {
    const record = await Record.findOne({ _id: req.params.id }).populate({
        path: "tracks",
        select: "position title key energyLevel bpm"
    });
    res.render("record/edit", { record });
});

router.post("/record/:id/edit", async (req, res) => {
    const tracks = Object.keys(req.body).filter(key => key.includes("track"));

    for (const track of tracks) {
        const index = track.split("-")[1];
        const key = req.body[`key-${index}`];
        const bpm = req.body[`bpm-${index}`];
        const energyLevel = req.body[`energyLevel-${index}`];

        const isCamelotIndex = Object.keys(camelotWheel).includes(key);
        // const isKey = Object.entries(camelotWheel).includes(key);

        await Track.findOneAndUpdate(
            { _id: req.body[`track-${index}`] },
            {
                $set: {
                    key: key
                        ? isCamelotIndex
                            ? key
                            : getCamelotIndex(key)
                        : null,
                    bpm: bpm ? bpm : null,
                    energyLevel: energyLevel ? energyLevel : null
                }
            }
        );
    }

    return res.redirect("/collections/fabiantjoeaon");
});

module.exports = router;
