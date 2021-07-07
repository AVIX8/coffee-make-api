const mongoose = require('mongoose')
const { connection } = require( "../config/database.js")

const categorySchema = new mongoose.Schema({
    title: {
        type: String,
    },
    path: {
        type: String,
        unique: true,
    },
    parent: {
        type: String,
        default: '/',
    },
    image: {
        type: String,
    },
})

const Category = connection.model('Category', categorySchema)

module.exports = Category
