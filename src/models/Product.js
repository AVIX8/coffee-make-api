const mongoose = require('mongoose')
const { connection } = require('../config/database')

const propertySchema = require('./schemas/property')
const variantSchema = require('./schemas/variant')

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
        required: true,
    },
    descr: {
        type: String,
    },
    imgs: {
        type: [{ type: String }],
    },
    attributes: {
        type: [propertySchema],
    },
    characteristics: {
        type: [propertySchema],
    },
    variants: {
        type: [variantSchema],
    },
    date: {
        type: Date,
        default: Date.now,
    },
})

const Product = connection.model('Product', productSchema) 

module.exports = Product
