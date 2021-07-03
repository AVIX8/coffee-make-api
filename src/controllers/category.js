const mongoose = require('mongoose')
const Category = require('../models/Category.js')
const Product = require('../models/Product.js')

module.exports.get = async (req, res) => {
    let { parentPath, parentId } = req.body

    if (parentId) {
        let parent = await Category.findById(parentId)
        if (!parent)
            return res
                .status(400)
                .send({ message: 'неверный идентификатор категории' })
        parentPath = parent.category
    }
    let categories = await Category.find({
        parent: new RegExp('^' + parentPath + '$'),
    })
    return res.send(categories)
}

module.exports.getProducts = async (req, res) => {
    let { category, all, skip } = req.body
    let products = await Product.find({
        category: new RegExp('^' + category + (all ? '' : '$')),
    }).skip(skip).limit(50)
    if (!products || !products.length)
        return res
            .status(404)
            .send({ message: 'Не удалось найти товары' })
    return res.send(products)
}

module.exports.create = async (req, res) => {
    let { title, parentId } = req.body

    if (!title) return res.status(400).send({ message: 'название категории обязательно' })
    let parentPath = ''
    if (mongoose.Types.ObjectId.isValid(parentId)) {
        let parent = await Category.findById(parentId)
        if (!parent)
            return res
                .status(400)
                .send({ message: 'неверный идентификатор категории' })
        parentPath = parent.category
    }
    let category = parentPath + '/' + title
    let cat = new Category({
        title,
        parent: parentPath,
        category,
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
    if (!category) {
        return res
            .status(400)
            .send({ message: 'неверный идентификатор категории' })
    }
    
    if (req.file) {
        if (category.image) {
            const imageId = new mongoose.Types.ObjectId(category.image);
            req.app.locals.bucket.delete(imageId)
        }

        await Category.findOneAndUpdate({_id: category._id}, {image: req.file?.id})
    }

    if (req.body.title && category.title != req.body.title) {

        

        //нужно ещё изменять у товаров
    }


    
}

module.exports.del = async (req, res) => {
    let category = await Category.findById(req.body.id)
    if (!category) {
        return res
            .status(400)
            .send({ message: 'неверный идентификатор категории' })
    }

    let subcategories = await Category.find({
        parent: new RegExp('^' + category.category + '$'),
    })
    if (subcategories.length) {
        return res
            .status(400)
            .send({
                message: 'у данной категории есть подкатегории',
            })
    }

    let products = await Product.find({
        parent: new RegExp('^' + category.category + '$'),
    })
    if (products.length)
        return res
            .status(400)
            .send({ message: 'у данной категории есть товары' })

    let deletedCategory = await Category.findByIdAndDelete(category._id)
    
    if (category.image) {
        const imageId = new mongoose.Types.ObjectId(category.image);
        req.app.locals.bucket.delete(imageId)
    }

    return res.send({ deletedCategory })
}
