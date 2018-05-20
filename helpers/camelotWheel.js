const camelotWheel = {
    "1A": "A♭Min",
    "1B": "BMaj",
    "2A": "E♭Min",
    "2B": "F#Maj",
    "3A": "B♭Min",
    "3B": "D♭Maj",
    "4A": "FMin",
    "4B": "A♭Maj",
    "5A": "CMin",
    "5B": "E♭Maj",
    "6A": "GMin",
    "6B": "B♭Maj",
    "7A": "DMin",
    "7B": "FMaj",
    "8A": "AMin",
    "8B": "CMaj",
    "9A": "EMin",
    "9B": "GMaj",
    "10A": "BMin",
    "10B": "DMaj",
    "11A": "F#Min",
    "11B": "AMaj",
    "12A": "D♭Min",
    "12B": "EMaj"
};

const getCamelotIndex = key =>
    Object.keys(camelotWheel).find(k => camelotWheel[k] === key);

const getKey = camelotIndex => camelotWheel[camelotIndex];

module.exports = {
    camelotWheel,
    getCamelotIndex,
    getKey
};
