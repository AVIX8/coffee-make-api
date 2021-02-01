const mongoose = require('mongoose')
const passportLocalMongoose = require('passport-local-mongoose')
const { connection } = require('../config/database')

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
        MissingPasswordError: 'Пароль не указан',
        AttemptTooSoonError: 'Аккаунт в настоящее время заблокирован. Попробуйте позже',
        TooManyAttemptsError:
            'Аккаунт заблокирован из-за слишком большого количества неудачных попыток входа',
        NoSaltValueStoredError:
            'Аутентификация невозможна. Значение соли не сохранено',
        IncorrectPasswordError: 'Пароль или адрес электронной почты неверны',
        IncorrectUsernameError: 'Пароль или адрес электронной почты неверны',
        MissingUsernameError: 'Электронная почта не указана',
        UserExistsError: 'Пользователь с данным адресом электронной почты уже зарегистрирован',
    },
})

const User = connection.model('User', userSchema)

module.exports = User
