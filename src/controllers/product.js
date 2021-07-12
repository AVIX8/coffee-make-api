const mongoose = require('mongoose')
const Product = require('../models/Product.js')
const Category = require('../models/Category.js')
const slugify = require('slugify')

const messages = {
    badСategory: 'Такой категории не существует',
    invalidProductId: 'Неверный идентификатор товара',
    productNotFound: 'Не удалось найти товар',
    productsNotFound: 'Не удалось найти товары',
    // badLogin: 'Пароль или адрес электронной почты неверны',
}

module.exports.getBySlug = async (req, res) => {
    let { slug } = req.body //?

    let product = await Product.findOne({ slug })
    if (!product)
        return res.status(404).send({ message: messages.productNotFound })
    return res.json(product)
}

module.exports.getByCategory = async (req, res) => {
    const { category } = req.body

    let products = await Product.find({ category })
    if (!products || !products.length)
        return res.status(404).send({ message: messages.productsNotFound })
    return res.json(products)
}

module.exports.del = async (req, res) => {
    let product = await Product.findById(req.body.id)
    if (!product) {
        return res.status(400).send({ message: messages.invalidProductId })
    }
    let deletedProduct = await Product.findByIdAndDelete(product._id)

    if (product.imgs.length)
        product.imgs.forEach((image) => {
            const imageId = new mongoose.Types.ObjectId(image)
            req.app.locals.bucket.delete(imageId)
        })
        
    return res.send({ deletedProduct })
}

module.exports.create = async (req, res) => {
    const { title, category } = req.body
    let slug = slugify(title)
    if (await Product.findOne({ slug })) {
        slug += '-' + Math.floor(Math.random() * 10)
        while (await Product.findOne({ slug }))
            slug += Math.floor(Math.random() * 10)
    }

    if (!category)
        return res.status(400).json({ message: messages.badСategory })
    let cat = await Category.findOne({ path: category })
    if (!cat) return res.status(400).json({ message: messages.badСategory })

    let prod = new Product({
        ...req.body,
        slug,
    })

    prod.save()
        .then((item) => {
            res.json(item)
        })
        .catch((err) => {
            let message
            if (err.code == 11000)
                message = 'Товар с таким слагом уже существует'
            else console.log(err)

            res.status(400).send({
                message: message ?? 'не удалось создать товар',
            })
        })
}

module.exports.get = async (req, res) => {
    let { filters, skip, limit } = req.body
    if (filters.category != undefined) {
        //
    }
    let products = await Product.find(filters).skip(skip).limit(limit ?? 50)

    if (!products || !products.length)
        return res.status(404).send({ message: messages.productsNotFound })
    return res.send(products)
}
