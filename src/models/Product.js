const mongoose = require('mongoose')
const { connection } = require('../config/database')

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    slug: {
        type: String,
        required: true,
        unique: true,
    },
    desc: {
        type: String,
    },
    brand: {
        type: String,
    },
    imgs: {
        type: [String],
    },
    properties: {
        type: Object
    },
    choiceProperty: {
        type: Object,
    },
})

const Product = connection.model('Product', productSchema) 

module.exports = Product
