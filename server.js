const mongoose = require('mongoose');
const app = require('./app');

mongoose.connect(
    'mongodb://fabiantjoeaon:bonkhetmaar77@ds217560.mlab.com:17560/discogs-collection-manager'
);
mongoose.promise = global.Promise;
mongoose.connection.on('error', err => {
    console.error(err, err.message);
});
// require('./models/Record');
// require('./models/Track');

app.set('port', '7777');
const server = app.listen(app.get('port'), () => {
    console.log(`Server running → PORT ${server.address().port}`);
});
