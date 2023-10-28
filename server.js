var express = require('express');
    app = express();
    port = process.env.PORT || 3000;
    mongoose = require('mongoose');
    Conference = require('./api/models/confModels');
    bodyParser = require('body-parser');
    mongocs = process.env.mongodb-cs 
    const Prometheus = require('prom-client');
    const collectDefaultMetrics = Prometheus.collectDefaultMetrics();

mongoose.Promise = global.Promise;
mongoose.connect(mongocs);

const database = mongoose.connection;

database.on('error', (error) => {
    console.log(error)
})

database.once('connected', () => {
    console.log('Database Connected');
})

app.use(bodyParser.urlencoded({ extended: true }));

app.use(bodyParser.json());

app.get('/metrics', async (req, res) => {
    res.set('Content-Type', Prometheus.register.contentType);
    res.end(await Prometheus.register.metrics());
});

var routes = require('./api/routes/confRoutes.js');

routes(app);

app.listen(port);

console.log('conference app API server started on:', port);