import User from '../models/User.js'
import passport from 'passport'

import bcrypt from 'bcryptjs'

import { registerValidation, loginValidation } from '../validation.js'

export async function register(req, res) {
    // const { error } = registerValidation(req.body)
    // if (error) return res.status(400).send(error.details[0].message)

    const emailExist = await User.findOne({ email: req.body.email })
    if (emailExist)
        return res
            .status(400)
            .send({ msg: 'Пользователь с такой почтой уже существует' })

    const salt = await bcrypt.genSalt()
    const hash = await bcrypt.hash(req.body.password, salt)

    const user = new User({
        email: req.body.email,
        hash: hash,
    })

    user.save()
        .then((data) => {
            console.log(data)
            res.send(savedUser)
        })
        .catch((err) => {
            console.error(err)
            res.status(400).send(error)
        })
}

export async function login(req, res) {
    passport.authenticate('local')(req, res, function () {
        console.log(`login: ${req.user}`)
        res.send(req.user)
    })

    // const { error } = loginValidation(req.body)
    // if (error) return res.status(400).send(error.details[0].message)

    // const user = await User.findOne({ email: req.body.email })
    // if (!user) return res.status(400).send("Email isn't found")

    // const validPassword = await bcrypt.compare(req.body.password, user.password)
    // if (!validPassword) res.status(400).send('Password is wrong')

    // passport.authenticate('local', (err, user, info) => {
    //     if (err) {
    //         return next(err)
    //     }

    //     if (!user) {
    //         return res.redirect('/login?info=' + info)
    //     }

    //     req.logIn(user, function (err) {
    //         if (err) {
    //             return next(err)
    //         }

    //         return res.redirect('/')
    //     })
    // })(req, res, next)

    // const token = jwt.sign({_id: user._id}, process.env.SECRET_KEY)
    // res.header('auth-token', token).send(token)
}

export function logout(req, res) {
    req.logout()
    res.send(`current user = ${req.user}`)
}

export function getUserData(req, res) {
    console.log('profile: getUserData')
    res.send({ profile: req.user })
}
