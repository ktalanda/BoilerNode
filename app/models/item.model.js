'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var ItemSchema = new Schema({
    name: {
        type: String,
        default: '',
        required: 'Please fill Item name',
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

mongoose.model('Item', ItemSchema);