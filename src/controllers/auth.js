const User = require('../models/User')
const Session = require('../models/Session')
const jwt = require('jsonwebtoken')
const uuid = require('uuid').v4
const bcryptjs = require('bcryptjs')

const { registerValidation, loginValidation } = require('../validation/user')

const messages = {
    userAlreadyExists:
        'Пользователь с данным адресом электронной почты уже зарегистрирован',
    badLogin: 'Пароль или адрес электронной почты неверны',
}

const issueAcessToken = (user) =>
    jwt.sign({ id: user._id, roles: user.roles }, process.env.JWT_SECRET_KEY, {
        expiresIn: '10s',
    })

module.exports.register = async (req, res) => {
    const { error } = registerValidation(req.body)
    if (error) return res.status(400).json(error.details[0])

    const { email, password } = req.body
    const candidate = await User.findOne({ email })
    if (candidate) {
        return res.status(400).json({ message: messages.userAlreadyExists })
    }
    const hashPassword = bcryptjs.hashSync(password)

    const user = new User({
        email,
        password: hashPassword,
        roles: ['user'],
    })
    await user.save()

    return res.json({ id: user._id })
}

module.exports.login = async (req, res) => {
    const { error } = loginValidation(req.body)
    if (error) return res.status(400).json(error.details[0])

    const { email, password } = req.body
    const user = await User.findOne({ email })

    if (!user || !bcryptjs.compareSync(password, user.password))
        return res.status(403).json({ message: messages.badLogin })

    const accessToken = issueAcessToken(user)
    const refreshToken = uuid()
    Session.create({ token: refreshToken, user, ip: '4.4.4.4' })
    return res.json({ accessToken, refreshToken })
}

module.exports.refresh = async (req, res) => {
    const session = await Session.findOne({
        token: req.body.refreshToken,
    }).populate('user')
    
    if (!session || !session.user) return res.status(404).send()    
    
    Session.findByIdAndDelete(session._id).exec()

    const accessToken = issueAcessToken(session.user)
    const refreshToken = uuid()

    Session.create({ token: refreshToken, user: session.user, ip: '4.4.4.4' })
    return res.json({ accessToken, refreshToken })
}

module.exports.logout = async (req, res) => {
    await Session.findOneAndDelete({
        token: req.body.refreshToken
    }).exec()
    return res.status(200).send()
}
