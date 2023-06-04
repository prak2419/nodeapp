'use strict';
var mongoose = require('mongoose');
var schema = mongoose.Schema;

var confSchema = new schema({
    id : {
        type: Number,
        required: 'Kindly enter the id of the conference'
        },
    speaker : {
        type: String,
        required: 'Kindly enter the speaker of the conference'
    },
    topic : { 
        type: String,
        required: 'Kindly enter the topic of the conference'
    },
    date : {
        type: Date,
    },
    sessionname : {
        type: String,
        required: 'Kindly enter the session name of the conference'
    }
});

const Conference = mongoose.model('conferences', confSchema);
module.exports = Conference;