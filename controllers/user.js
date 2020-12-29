import User from '../models/User.js'
import passport from 'passport'

import { registerValidation, loginValidation } from '../validation.js'

export async function register(req, res) {
    const { error } = registerValidation(req.body)
    if (error) return res.status(400).send(error.details[0].message)

    const emailExist = await User.findOne({ email: req.body.email })
    if (emailExist)
        return res
            .status(400)
            .send({ msg: 'Пользователь с такой почтой уже существует' })

    console.log('registering user')
    User.register(
        new User({ email: req.body.email }),
        req.body.password,
        (err) => {
            if (err) {
                console.log('error while user register!', err)
                return next(err)
            }

            console.log('user registered')
            res.send('user registered')
        }
    )
}

export async function login(req, res) {
    passport.authenticate('local')(req, res, () => {
        console.log(`login: ${req.user.id}`)
        res.send({id: req.user.id})
    })
}

export function logout(req, res) {
    req.logout()
    res.send(`current user = ${req.user}`)
}

export function getUserData(req, res) {
    console.log('profile: getUserData')
    res.send({ profile: req.user })
}
