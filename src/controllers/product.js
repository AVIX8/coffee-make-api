const mongoose = require('mongoose')
const Product = require('../models/Product.js')
const Category = require('../models/Category.js')
const slugify = require('slugify')

const messages = {
    titleIsRequired: 'Нет названия продукта',
    badСategory: 'Такой категории не существует',
    invalidProductId: 'Неверный идентификатор товара',
    productNotFound: 'Не удалось найти товар',
    productsNotFound: 'Не удалось найти товары',
    // badLogin: 'Пароль или адрес электронной почты неверны',
}

Array.prototype.sortBy = function (p) {
    return this.slice(0).sort(function (a, b) {
        return a[p] > b[p] ? 1 : a[p] < b[p] ? -1 : 0
    })
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

    product.imgs.forEach((image) => {
        req.app.locals.bucket.delete(new mongoose.Types.ObjectId(image))
    })

    return res.send({ deletedProduct })
}

module.exports.create = async (req, res) => {
    const data = JSON.parse(req.body.data)
    const { title, category } = data ?? {}

    if (!category)
        return res.status(400).json({ message: messages.badСategory })
    let cat = await Category.findOne({ path: category })
    if (!cat) return res.status(400).json({ message: messages.badСategory })

    if (!title)
        return res.status(400).json({ message: messages.titleIsRequired })
    let slug = slugify(title)
    if (await Product.findOne({ slug })) {
        slug += '-' + Math.floor(Math.random() * 10)
        while (await Product.findOne({ slug }))
            slug += Math.floor(Math.random() * 10)
    }

    let imgs = []
    req.files.forEach((file) => {
        imgs.push(file.id)
    })
    if (data.characteristics?.length)
        data.characteristics = data.characteristics.sortBy('title')
    if (data.attributes?.length)
        data.attributes = data.attributes.sortBy('title')

    let prod = new Product({
        ...data,
        slug,
        imgs,
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

module.exports.update = async (req, res) => {
    const data = JSON.parse(req.body.data)
    const product = await Product.findById(data._id)

    if (product.category !== data.category) {
        if (!data.category)
            return res.status(400).json({ message: messages.badСategory })
        let cat = await Category.findOne({ path: data.category })
        if (!cat) return res.status(400).json({ message: messages.badСategory })
        product.category = data.category
    }

    if (product.title !== data.title) {
        if (!data.title)
            return res.status(400).json({ message: messages.titleIsRequired })

        product.title = data.title
        let slug = slugify(data.title)
        if (await Product.findOne({ slug })) {
            slug += '-' + Math.floor(Math.random() * 10)
            while (await Product.findOne({ slug }))
                slug += Math.floor(Math.random() * 10)
        }
        product.slug = slug
    }

    product.descr = data.descr
    if (data.characteristics?.length)
        product.characteristics = data.characteristics.sortBy('title')
    if (data.attributes?.length)
        product.attributes = data.attributes.sortBy('title')
    product.optionTitle = data.optionTitle
    product.options = data.options
    product.price = data.price

    let newImgs = []
    data.images.forEach((img) => {
        if (img.id) {
            if (product.imgs.includes(img.id)) newImgs.push(img.id)
            else console.log(`${img.id} нету`)
        } else if (req.files.length) {
            newImgs.push(req.files.shift().id)
        }
    })
    let toDel = product.imgs.filter((id) => !newImgs.includes(id))
    toDel.forEach((id) => {
        req.app.locals.bucket.delete(new mongoose.Types.ObjectId(id))
    })
    product.imgs = newImgs

    product
        .save()
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
    console.log(req.body)
    let { category, deep, filters, skip, limit } = req.body
    
    filters = filters ?? {}
    deep = deep ?? true
    category = category ?? ''
    
    let products = await Product.find({
        ...filters,
        category: new RegExp('^' + category + (deep ? '' : '$')),
    })
        .skip(skip ?? 0)
        .limit(limit ?? 3)

    if (!products || !products.length)
        return res.status(404).send({ message: messages.productsNotFound })
    return res.send(products)
}
