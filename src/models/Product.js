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
    imgs: {
        type: [{ type: String }],
    },
    category: {
        type: String,
    },
    characteristics: {
        type: Array,
    },
    optionTitle: {
        type: String,
    },
    options: {
        type: Array,
    }
})

const Product = connection.model('Product', productSchema) 

module.exports = Product
