const Joi = require('joi')

const registerSchema = Joi.object({
    name: Joi.string().required().min(3).max(255),
    email: Joi.string().required().min(6).max(255).email(),
    password: Joi.string().required().min(8).max(1024).required(),
})

const loginSchema = Joi.object({
    email: Joi.string().required().min(6).max(255).email(),
    password: Joi.string().required().min(8).max(1024).required(),
})

module.exports.registerValidation = (body) => {
    return registerSchema.validate(body)
}
module.exports.loginValidation = (body) => {
    return loginSchema.validate(body)
}
