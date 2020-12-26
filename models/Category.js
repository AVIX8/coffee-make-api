const mongoose = require('mongoose')
const Product = require('./Product')
const categorySchema = new mongoose.Schema({
    slug: {
        type: String,
        required: true,
        unique: true,
    },
    name: {
        type: String,
    },
    products: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product',
        },
    ],
})

module.exports = mongoose.model('Category', categorySchema)
