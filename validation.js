import Joi from 'joi'

const registerSchema = Joi.object({
    name: Joi.string().required().min(3).max(255),
    email: Joi.string().required().min(6).max(255).email(),
    password: Joi.string().required().min(8).max(1024).required(),
})

const loginSchema = Joi.object({
    email: Joi.string().required().min(6).max(255).email(),
    password: Joi.string().required().min(8).max(1024).required(),
})

let registerValidation = (body) => {
    return registerSchema.validate(body)
}

let loginValidation = (body) => {
    return loginSchema.validate(body)
}

export { registerValidation, loginValidation }
