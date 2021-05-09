const mongoose = require('mongoose')
const { connection } = require('../config/database')

const roles = [
    'user',
    'admin',
    'moderator'
]

const roleSchema = new mongoose.Schema({
    value: {type: String, unique: true},
})

const Role = connection.model('Role', roleSchema)

roles.forEach((role) => {
    Role.findOne({value: role}).exec().then((data) => {
        if (!data) {
            Role.create({value: role})
        }
    })
})

module.exports = Role
