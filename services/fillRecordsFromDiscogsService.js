const { get } = require('axios');
const chunk = require('lodash/chunk');

const DiscogsCollection = require('../models/DiscogsCollection');
const Record = require('../models/Record');
const Track = require('../models/Track');
const { Client } = require('disconnect');
const filterDeepUnique = require('../helpers/filterDeepUnique');
require('../helpers/range');

const userToken = 'HWBhHPguZBgxsEFzIDJMqndMxdPBbxFxMobwArzG';
const client = new Client({ userToken });
const db = client.database();

const catchAsync = async (fn, ...params) => {
    let res;
    try {
        res = await fn(...params);
    } catch (e) {
        console.log('Something went wrong', e);
    } finally {
        return res;
    }
};
const catchM = async (fn, ...params) => {
    let res;
    try {
        res = await fn(...params).exec();
    } catch (e) {
        console.log('Something went wrong', e);
    } finally {
        return res;
    }
};

const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

const fetchCollectionPageWrapped = (page, username) =>
    catchAsync(client.user().collection().getReleases, username, 0, {
        page,
        per_page: 100
    });

const fetchCollectionFromDiscogs = async username => {
    console.log(`Fetching collection from ${username} 🎧`);
    let totalReleases = [];
    const {
        pagination: { urls, pages },
        releases
    } = await fetchCollectionPageWrapped(0, username);

    for (const page of [...pages]) {
        console.log(
            `> Fetching collection page ${page}, currently on ${
                totalReleases.length
            } records 🎼`
        );
        if (page === 0) {
            totalReleases = [...releases];
        } else {
            const {
                releases: releasesPerPage
            } = await fetchCollectionPageWrapped(page, username);
            totalReleases = [...totalReleases, ...releasesPerPage];
        }
    }

    // Return only unique values
    return filterDeepUnique(totalReleases, 'id');
};

const fillCollectionWithReleaseData = async collection => {
    console.log(
        '🎼 Now filling collection with release data,',
        'please allow ~ 1 minute between each chunk of data because of Discogs API limit!'
    );
    const filledCollection = [];
    const chunked = chunk(collection[0], 50);

    let i = 0;
    for (const chunkedCollection of chunked) {
        const corrected = i + 1;
        if (i !== 0) await sleep(60000);

        console.log(
            `> Fetching chunk ${corrected} of ${chunked.length}, total ${
                chunkedCollection.length
            } records 🎹`
        );

        for (const {
            id,
            basic_information: { title }
        } of chunkedCollection) {
            console.log(`>> Fetching record ${title}`);

            const { data } = await catchAsync(
                get,
                `https://api.discogs.com/releases/${id}?token=${userToken}`
            );

            filledCollection.push(data);
            console.log(filledCollection.length);
        }
        i++;
    }

    return filledCollection;
};

const updateCollection = async ({ username }) => {
    let existingCollection = await DiscogsCollection.findOne({
        username
    });

    let fetchedCollectionFromDiscogs = await fetchCollectionFromDiscogs(
        username
    );

    if (!existingCollection) {
        existingCollection = new DiscogsCollection({ username });
        await existingCollection.save();
    } else {
        // Existing collection, update only new releases
        const records = await Record.find({
            discogsCollection: existingCollection._id
        });
        const recordIds = records.map(r => r.discogsId);

        fetchedCollectionFromDiscogs = fetchedCollectionFromDiscogs.filter(
            release => !recordIds.includes(release.id)
        );
    }

    const filledCollection = await fillCollectionWithReleaseData([
        fetchedCollectionFromDiscogs
    ]);
    console.log('inserting tracks into db...');
    for (const record of filledCollection) {
        console.log(`>> doing ${record.title}`);
        const tracks = [];

        const r = new Record({
            discogsId: record.id,
            title: record.title,
            image: record.thumb,
            year: record.year,
            artists: record.artists.map(a => a.name),
            genres: record.genres,
            styles: record.styles,
            labels:
                record.labels &&
                record.labels.length > 1 &&
                record.labels.map(l => l.name),
            videos:
                record.videos &&
                record.videos.length > 1 &&
                record.videos.map(v => v.title),
            discogsCollection: existingCollection._id
        });

        for (const { duration, position, title } of record.tracklist) {
            const t = new Track({ duration, position, title, record: r._id });
            await t.save();
            r.tracks.push(t);
        }

        await r.save();
    }
    console.log('DONE');
};

module.exports = {
    updateCollection
};
