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
    imgs: {
        type: [{ type: String }],
    },
    attributes: {
        type: [{ type: Object }],
    },
    characteristics: {
        type: [{ type: Object }],
    },
    variants: {
        type: [{ type: Object}],
    },
    date: {
        type: Date,
        default: Date.now(),
    },
})

productSchema.index('variants.SKU', {unique: true})
const Product = connection.model('Product', productSchema) 

module.exports = Product
