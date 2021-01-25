const User = require('../models/User')
const passport = require('passport')

const { registerValidation, loginValidation } = require('../src/validation')

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

            // console.log('user registered')
            passport.authenticate('local')(req, res, () => {
                // console.log(`login: ${req.user.id}`)
                res.send({ id: req.user.id })
            })
        }
    )
}

module.exports.login = async (req, res) => {
    const { error } = loginValidation(req.body)
    if (error) return res.status(400).send(error.details[0])

    passport.authenticate('local', (err, user, info) => {
        if (err) return res.status(500)
        if (info) return res.status(400).send(info)
        req.logIn(user, function (err) {
            if (err) return res.status(500)
            return res.send({ id: user.id })
        })
    })(req, res)
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
