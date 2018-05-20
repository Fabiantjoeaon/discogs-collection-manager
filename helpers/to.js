const to = promise => {
    return promise
        .then(data => ({
            err: null,
            data
        }))
        .catch(err => {
            err;
        });
};

module.exports = to;
