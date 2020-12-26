const { number } = require('joi')
const mongoose = require('mongoose')
const productSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        min: 3,
        max: 255,
    },
    venderCode: {
        type: String,
        required: true,
        unique: true,
        min: 3,
        max: 255,
    },
    price: {
        type: Number
    },
    images: {
        type: [String]
    }

})

module.exports = mongoose.model('Product', productSchema)
