const Product = require('../models/Product.js')

const messages = require('../messages.js')

async function getValidItems(items) {
    if (!items?.length) throw messages.cartIsRequired

    let totalPrice = 0
    let validItems = await Promise.all(
        items.map(async (x) => {
            let product = await Product.findOne({
                'variants.SKU': x.SKU,
            })
                .lean()
                .catch((error) => {
                    throw `Не корректный SKU (${JSON.stringify(error.value)})`
                })

            if (product == null) throw `Товар с SKU ${x.SKU} не найден`

            product.variants = [
                product.variants.find((variant) => variant.SKU === x.SKU),
            ]

            if (!product.variants[0].inStock)
                throw `Товара ${product.title} нет в наличии`

            totalPrice += product.variants[0].price * x.quantity
            return product
        })
    )
    return { items:validItems, totalPrice }
}

module.exports.get = async (req, res) => {
    res.send(req.body)
}

module.exports.getValid = async (req, res) => {
    let validItems
    try {
        validItems = await getValidItems(req.body.items)
    } catch (error) {
        res.status(400).send({ message: error })
    }

    res.status(200).send({validItems})
}

module.exports.create = async (req, res) => {
    console.log(req.body)
    let validItems
    try {
        validItems = await getValidItems(req.body.items)
    } catch (error) {
        res.status(400).send({ message: error })
    }
    // console.log(JSON.stringify(validItems), JSON.stringify(req.validItems));
    if (JSON.stringify(validItems) != JSON.stringify(req.body.validItems)) {
        res.status(426).send({
            message: 'Информация о товарах была обновлена',
            validItems,
        })
    } else {
        res.status(200).send({
            message: 'Заказ успешно оформлен',
            orderId: 'пока не работает',
        })
    }
}

module.exports.createWithLogin = async (req, res) => {
    res.send(req.body)
}
