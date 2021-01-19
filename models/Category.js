const mongoose = require('mongoose')
// const connection = require( "../config/database.js")

const categorySchema = new mongoose.Schema({
    name: {
        type: String,
    },
    parent: {
        type: String,
        default: '/',
    },
    category: {
        type: String,
        unique: true,
    },
    image: {
        type: String,
    },
})

const Category = mongoose.model('Category', categorySchema)

module.exports.default = Category
