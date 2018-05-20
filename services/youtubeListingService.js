const DiscogsCollection = require('../models/DiscogsCollection');
const Record = require('../models/Record');
const Track = require('../models/Track');

const listMissingVideos = async ({ username }) => {
    const list = [];
    const collection = await DiscogsCollection.findOne({ username });
    const records = await Record.find({ discogsCollection: collection._id });

    for (const record of records) {
        const recordMessages = [];
        const name = `${record.artists[0]} - ${record.title}`;
        if (!(record.videos) || record.videos.length === 0)
            recordMessages.push(`${name} has no videos on discogs.`);
        else if (
            record.videos.length > 0 &&
            record.videos.length < record.tracks.length
        ) {
            recordMessages.push(`${name} might miss some videos`);
            for (const video of record.videos) {
                recordMessages.push(`>> It does have: "${video}"`);
            }
        }

        if (recordMessages.length > 0) list.push(recordMessages);
    }

    return list;
};

module.exports = { listMissingVideos };
