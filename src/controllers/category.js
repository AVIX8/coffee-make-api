const mongoose = require('mongoose')
const Category = require('../models/Category.js')

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
    return res.send({ categories })
}

module.exports.create = async (req, res) => {
    let { name, parentId } = req.body
    console.log(req.body);
    if (!name) return res.status(400).send({ message: 'имя обязательно' })
    let parentPath = ''
    if (mongoose.Types.ObjectId.isValid(parentId)) {
        let parent = await Category.findById(parentId)
        if (!parent)
            return res
                .status(400)
                .send({ message: 'неверный идентификатор категории' })
        parentPath = parent.category
    }
    let category = parentPath + '/' + name
    let cat = new Category({
        name,
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

            return res.status(400).send({
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

    if (req.body.name && category.name != req.body.name) {

        

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

    //нужно убедиться, что ни один товары не принадлежит этой категории

    let deletedCategory = await Category.findByIdAndDelete(category._id)
    
    if (category.image) {
        const imageId = new mongoose.Types.ObjectId(category.image);
        req.app.locals.bucket.delete(imageId)
    }

    res.send({ deletedCategory })
}
