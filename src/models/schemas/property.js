const mongoose = require('mongoose')

module.exports = new mongoose.Schema({
    _id: false,
    i: {
        type: Number
    },
    title: {
        type: String,
        required: true,
    },
    value: {
        type: String,
        required: true,
    }
})