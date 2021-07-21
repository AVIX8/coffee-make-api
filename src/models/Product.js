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
    category: {
        type: String,
    },
    descr: {
        type: String,
    },
    price: {
        type: Number
    },
    imgs: {
        type: [{ type: String }],
    },
    attributes: {
        type: [{ type: Object }],
    },
    characteristics: {
        type: [{ type: Object }],
    },
    optionTitle: {
        type: String,
    },
    options: {
        type: Array,
    },
    date: {
        type: Date,
        default: Date.now(),
    },
    inStock: {
        type: Boolean,
        defauld: false,
    }
})

const Product = connection.model('Product', productSchema) 

module.exports = Product
