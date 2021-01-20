const mongoose = require('mongoose')
const passportLocalMongoose = require('passport-local-mongoose')
const connection = require('../config/database')

const userSchema = new mongoose.Schema({
    hash: {
        // for passport-local-mongoose
        type: String,
    },
    salt: {
        // for passport-local-mongoose
        type: String,
    },
    email: {
        type: String,
        required: true,
        max: 255,
    },
    name: {
        type: String,
        max: 255,
    },
    date: {
        type: Date,
        default: Date.now(),
    },
    admin: {
        type: Boolean,
    }
})

userSchema.plugin(passportLocalMongoose, {
    usernameField: 'email',

    errorMessages: {
        MissingPasswordError: 'No password was given',
        AttemptTooSoonError: 'Account is currently locked. Try again later',
        TooManyAttemptsError:
            'Account locked due to too many failed login attempts',
        NoSaltValueStoredError:
            'Authentication not possible. No salt value stored',
        IncorrectPasswordError: 'Password or email are incorrect',
        IncorrectUsernameError: 'Password or email are incorrect',
        MissingUsernameError: 'No email was given',
        UserExistsError: 'A user with the given email is already registered',
    },
})

const User = connection.model('User', userSchema)

module.exports = User
