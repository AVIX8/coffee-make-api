const mongoose = require('mongoose')
const { connection } = require('../config/database')
const variantSchema = require('./schemas/variant')
const uuid = require('uuid').v4

const cartItem =  new mongoose.Schema({
    SKU: {
        type: String,
    },
    price: {
        type: Number,
    },
    variant: {
        type: variantSchema,
    },
    quantity: {
        type: Number
    },
    product: {
        type: mongoose.Schema.ObjectId,
        ref: 'Product',
    },
})

const orderSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
    },
    fullName: {
        type: String,
    },
    phone: {
        type: String,
    },
    address: {
        type: String,
    },
    items: {
        type: [cartItem],
    },
    status: {
        type: String,
    },
    totalPrice: {
        type: Number,
    },
    date: {
        type: Date,
        default: Date.now,
    },
    code: {
        type: String,
        unique: true,
        default: uuid,
    },
})

const Product = connection.model('Order', orderSchema)

module.exports = Product
