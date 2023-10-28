'use strict';

var mongoose = require('mongoose'),
    Conference = mongoose.model('conferences');

    const Prometheus = require('prom-client');
    const collectDefaultMetrics = Prometheus.collectDefaultMetrics();

exports.list_all_conferences = async (req, res) => {
    let results;
    results = await Conference.find()
    res.json(results);
};


exports.create_a_conference = async (req, res) => {
    var new_conf = new Conference(req.body);
    let result;
    result = await new_conf.save();
    res.json(result);
};

exports.read_a_conference = async (req, res) => {
    var id = req.params.id;
    let result;
    result = await Conference.findOne({ id: id});
    res.json(result);
};

//exports.update_a_conference = async (req, res) => {
 //   var id = req.params.id;
 //   let results;
 //   results = await Conference.findOneAndUpdate({id}, req.body , {upsert: true, new: true} );
 //   return(res.status(200), "Record updated successfully")
//};

exports.list_all_conferences_by_speakername = async (req, res) => {
    var speaker = req.params.speaker;
    let results;
    results = await Conference.find({ speaker: speaker});
    res.json(results);
};

exports.list_all_conferences_by_sessionname = async (req, res) => {
    var sessionname = req.params.sessionname;
    let results;
    results = await Conference.find({ sessionname: sessionname});
    res.json(results);
};

exports.delete_a_conference = async (req, res) => {
    var id = req.params.id;
    let results;
    results = await Conference.remove( { id: id });
    res.json(results);
};

exports.send_metrics =  async (req, res) => {
    res.set('Content-Type', Prometheus.register.contentType);
    res.end(await Prometheus.register.metrics());
};
