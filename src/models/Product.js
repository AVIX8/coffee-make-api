const mongoose = require('mongoose')
const { connection } = require('../config/database')

const productSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    slug: {
        type: String,
        required: true,
        unique: true,
    },
    descr: {
        type: String,
    },
    brand: {
        type: String,
    },
    imgs: {
        type: [String],
    },
    properties: {
        type: Object,
    },
    choiceProperty: {
        type: Object,
    },
    category: {
        type: String,
    }
})

const Product = connection.model('Product', productSchema) 

module.exports = Product
