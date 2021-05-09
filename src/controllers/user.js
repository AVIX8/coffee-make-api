const User = require('../models/User')
const Role = require('../models/Role')
const jwt = require('jsonwebtoken');
const bcryptjs = require('bcryptjs');

const { registerValidation, loginValidation } = require('../validation/user')

const messages = {
    userAlreadyExists: "Пользователь с данным адресом электронной почты уже зарегистрирован",
    badLogin: 'Пароль или адрес электронной почты неверны',
}

const generateAccessToken = (id, roles) => {
    const payload = {
        id,
        roles
    }
    return jwt.sign(payload, process.env.JWT_SECRET_KEY, {expiresIn: "10m"} )
}

module.exports.register = async (req, res) => {
    const { error } = registerValidation(req.body)
    if (error) return res.status(400).send(error.details[0])

    const { email, password } = req.body
    const candidate = await User.findOne({ email })
    if (candidate) {
        return res.status(400).json({message: messages.userAlreadyExists})
    }
    const hashPassword = bcryptjs.hashSync(password);
    const userRole = await Role.findOne({value: "user"})
    const user = new User({email, password: hashPassword, roles: [userRole.value]})
    await user.save()

    return res.json({id:user._id})
} 

module.exports.login = async (req, res) => {
    const { error } = loginValidation(req.body)
    if (error) return res.status(400).json(error.details[0])

    const { email, password } = req.body
    User.findOne({email}).exec().then((user) => {
        if (!user) return res.status(401).json({ message: messages.badLogin})

        const isValid = bcryptjs.compareSync(password, user.password);
        if (isValid) {
            const accessToken = generateAccessToken(user._id, user.roles)
            return res.json({accessToken})
        } else {
            return res.status(400).json({ message: messages.badLogin})
        }

    }).catch((err) => {
        console.log(err);
        return res.status(500);
    })
}

// не работает
module.exports.logout = (req, res) => {
    // req.logout()
    return res.send({ user: req.user })
}

module.exports.getUserData = (req, res) => {
    return res.send({ user: req.user })
}

// доделать
module.exports.profile = (req, res) => {
    return res.send({ profile: { user: req.user, orders: {} } })
}
