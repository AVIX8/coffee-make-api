const mongoose = require('mongoose')
const { connection } = require('../config/database')


const propertySchema = new mongoose.Schema({
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

const variantSchema = new mongoose.Schema({
    SKU: {
        type: String,
        required: true,
        unique: true,
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
    }
})

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
        default: Date.now(),
    },
})

const Product = connection.model('Product', productSchema) 

module.exports = Product
