const mongoose = require('mongoose')

const propertySchema = require('./property')

module.exports = new mongoose.Schema({
    SKU: {
        type: String,
        required: true,
    },
    attributes: {
        type: [propertySchema],
    },
    price: {
        type: Number,
        required: true,
    },
    inStock: {
        type: Boolean,
        requred: true,
    },
})