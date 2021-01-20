const mongoose = require('mongoose')
const connection = require( "../config/database.js")

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

const Category = connection.model('Category', categorySchema)

module.exports = Category
