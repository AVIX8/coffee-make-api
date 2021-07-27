const mongoose = require('mongoose')
const { connection } = require('../config/database')

const userSchema = new mongoose.Schema({
    password: {
        type: String,
    },
    email: {
        type: String,
        required: true,
        max: 255,
    },
    fullName: {
        type: String,
        max: 255,
    },
    date: {
        type: Date,
        default: Date.now,
    },
    roles: [{ type: String, ref: 'Role' }],
})

const User = connection.model('User', userSchema)

module.exports = User
