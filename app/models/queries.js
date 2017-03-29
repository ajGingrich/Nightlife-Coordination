'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Attending = new Schema({
    users: []
});

var Query = new Schema({
    name: [],
    url: [],
    attending: [Attending],
    img: []
});

module.exports = mongoose.model('Query', Query);
