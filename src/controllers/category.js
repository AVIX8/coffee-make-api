const mongoose = require('mongoose')
const Category = require('../models/Category.js')
const Product = require('../models/Product.js')

let messages = {
    categoriesNotFound: 'Не удалось найти категории',
    productsNotFound: 'Не удалось найти товары'
}

module.exports.get = async (req, res) => {
    let { parentPath } = req.body
    let categories = await Category.find({
        parent: new RegExp('^' + parentPath + '$'),
    })
    return res.send(categories)
}

module.exports.getProducts = async (req, res) => {
    let { path, all, skip } = req.body
    let products = await Product.find({
        category: new RegExp('^' + path + (all ? '' : '$')),
    })
        .skip(skip)
        .limit(50)
    if (!products || !products.length)
        return res.status(404).send({ message: messages.productsNotFound })
    return res.send(products)
}

module.exports.getInfo = async (req, res) => {
    let products = Product.find({category: req.body.category})
    let characteristics = await products.distinct("characteristics")
    let attributes = await products.distinct("attributes")
    let optionTitles = await products.distinct("optionTitle")
    res.send({attributes, characteristics, optionTitles})
}

module.exports.getFilters = async (req, res) => {
    let characteristics = await Product.find({category: req.body.category}).distinct("characteristics")
    res.send(characteristics)
}

module.exports.create = async (req, res) => {
    let { title, parentId } = req.body

    if (!title)
        return res
            .status(400)
            .send({ message: 'название категории обязательно' })
    let parentPath = ''
    if (mongoose.Types.ObjectId.isValid(parentId)) {
        let parent = await Category.findById(parentId)
        if (!parent)
            return res
                .status(400)
                .send({ message: 'неверный идентификатор категории' })
        parentPath = parent.path
    }
    let path = parentPath + '/' + title
    let cat = new Category({
        title,
        path,
        parent: parentPath,
        image: req.file?.id,
    })
    cat.save()
        .then((item) => {
            res.send(item)
        })
        .catch((err) => {
            let message
            if (err.code == 11000) {
                message = 'такая категория уже существует'
            } else {
                console.log(err)
            }

            res.status(400).send({
                message: message ?? 'не удалось создать категорию',
            })
        })
}

module.exports.update = async (req, res) => {
    let category = await Category.findById(req.body.id)
    category //?
    if (!category) {
        return res
            .status(400)
            .send({ message: 'неверный идентификатор категории' })
    }

    if (req.file) {
        if (category.image) {
            req.app.locals.bucket.delete(new mongoose.Types.ObjectId(category.image))
        }

        await Category.findOneAndUpdate(
            { _id: category._id },
            { image: req.file?.id }
        )
    }
    let newTitle = req.body.title //?
    if (newTitle && newTitle != category.title) {
        category.title = newTitle
        await category.save()

        let newFullPath =
            category.path.slice(0, category.path.lastIndexOf('/') + 1) +
            newTitle

        let categories = await Category.find({path: new RegExp('^' + category.path) }) //?
        await Promise.all(categories.map(c => {
            c.parent = c.parent.replace(category.path, newFullPath);
            c.path = c.path.replace(category.path, newFullPath);
            return c.save()
        }))

        let products = await Product.find({category: new RegExp('^' + category.path) }) //?
        await Promise.all(products.map(p => {
                p.category=p.category.replace(category.path, newFullPath);
                return p.save()
            }))
        
        
    }
    return res.send(category)
}

module.exports.del = async (req, res) => {
    let category = await Category.findById(req.body.id)
    if (!category) {
        return res
            .status(400)
            .send({ message: 'неверный идентификатор категории' })
    }

    let subcategories = await Category.find({
        parent: new RegExp('^' + category.path + '$'),
    })
    if (subcategories.length) {
        return res.status(400).send({
            message: 'у данной категории есть подкатегории',
        })
    }

    let products = await Product.find({
        parent: new RegExp('^' + category.path + '$'),
    })
    if (products.length)
        return res
            .status(400)
            .send({ message: 'у данной категории есть товары' })

    let deletedCategory = await Category.findByIdAndDelete(category._id)

    if (category.image) {
        req.app.locals.bucket.delete(new mongoose.Types.ObjectId(category.image))
    }

    return res.send({ deletedCategory })
}
