const filterDeepUnique = (arr, prop) =>
    arr.filter(
        // HINT: Curry instantly with filter!
        (set => r => !set.has(r[prop]) && set.add(r[prop]))(new Set())
    );

module.exports = filterDeepUnique;
