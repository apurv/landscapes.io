'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
Schema = mongoose.Schema;


var appSettingsSchema = new Schema({
    createdAt: { type: Date, default: Date.now },
    createdBy: { type: Schema.ObjectId, ref: 'User'},

    defaultIcon: { type: String, required: true, default: 'images/AWS.png' },
    defaultAccount: { type: Schema.ObjectId, ref: 'Account' },
    s3Bucket: { type: String, required: true, default: 'landscapes.io' }

});

mongoose.model('AppSettings', appSettingsSchema);