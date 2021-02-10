const User = require('../models/User')
const passport = require('passport')
const jwt = require('jsonwebtoken');

const { registerValidation, loginValidation } = require('../validation/user')

module.exports.register = async (req, res) => {
    const { error } = registerValidation(req.body)
    if (error) return res.status(400).send(error.details[0])

    // console.log('registering user')
    User.register(
        new User({ email: req.body.email }),
        req.body.password,
        (err) => {
            if (err) {
                // console.log(err.message)
                return res.status(400).send(err)
            }

            console.log('user registered')
            passport.authenticate('local', { session: false })(req, res, () => {
                console.log(`login: ${req.user}`)
                res.send({ id: req.user.id })
            })
        }
    )
} 

module.exports.login = async (req, res, next) => {
    const { error } = loginValidation(req.body)
    if (error) return res.status(400).send(error.details[0])

    passport.authenticate('login', { session: false }, (err, user, info) => {
        if (err) return res.status(500)
        if (info) return res.status(400).send(info)
        req.logIn(user, (err) => {
            if (err) return next(err)
            console.log(user)
            const token = jwt.sign({ sub: user._id }, 'TOP_SECRET');

            return res.send({ id: user.id, token })
        })
    })(req, res, next)
}

module.exports.logout = (req, res) => {
    req.logout()
    res.send({ user: req.user })
}

module.exports.getUserData = (req, res) => {
    res.send({ user: req.user })
}

// доделать
module.exports.profile = (req, res) => {
    res.send({ profile: { user: req.user, orders: {} } })
}
