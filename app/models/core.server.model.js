'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var CoreSchema = new Schema({
    name: {
        type: String,
        default: '',
        required: 'Please fill name',
        trim: true
    },
    created: {
        type: Date,
        default: Date.now
    },
    modified: {
        type: Date,
        default: Date.now
    }
});

mongoose.model('Core', CoreSchema);
