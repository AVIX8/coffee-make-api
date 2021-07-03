// const mongoose = require('mongoose')
const Product = require('../models/Product.js')
const slugify = require('slugify')

const messages = {
    invalidSlug: 'Не корректный slug',
    // badLogin: 'Пароль или адрес электронной почты неверны',
}

module.exports.getBySlug = async (req, res) => {
    let { slug } = req.body

    let product = await Product.findOne({ slug })
    if (!product)
        return res
            .status(404)
            .send({ message: 'Не удалось найти товар' })
    return res.json(product)
}

module.exports.getByCategory = async (req, res) => {
    const { category } = req.body

    let products = await Product.find({ category })
    if (!products || !products.length)
        return res
            .status(404)
            .send({ message: 'Не удалось найти товар' })
    return res.json(products)
}

module.exports.create = async (req, res) => {
    const data = req.body
    const slug = data.slug
    if (!slug || slug != slugify(slug))
        return res.status(400).json(messages.invalidSlug)
    let prod = new Product({
        ...data,
    })

    prod.save()
        .then((item) => {
            res.json(item)
        })
        .catch((err) => {
            let message
            if (err.code == 11000) {
                message = 'Товар с таким слагом уже существует'
            } else {
                console.log(err)
            }

            res.status(400).send({
                message: message ?? 'не удалось создать товар',
            })
        })
}
