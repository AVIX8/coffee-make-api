const Product = require('../models/Product.js')
const Order = require('../models/Order.js')

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
            product.variants[0].quantity = x.quantity
            return product
        })
    )
    return { items: validItems, totalPrice }
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

    res.status(200).send({ validItems })
}

module.exports.create = async (req, res) => {
    console.log(req.body)
    let validItems
    try {
        validItems = await getValidItems(req.body.items)
    } catch (error) {
        res.status(400).send({ message: error })
    }
    if (JSON.stringify(validItems) != JSON.stringify(req.body.validItems))
        return res.status(426).send({
            message: 'Информация о товарах была обновлена',
            validItems,
        })
    
    let { fullName, phone, address } = req.body

    let order = await Order.create( {

        fullName,
        phone,
        address,
        totalPrice: validItems.totalPrice,
        items: validItems.items.map(item => {
            return {
                product: item,
                variant: item.variants[0],
                SKU: item.variants[0].SKU,
                price: item.variants[0].price,
                quantity: item.variants[0].quantity,
            }
        })
        
    }
    )
    

    try {
        let savedOrder = await order.save()
        savedOrder = await savedOrder.populate('items.product').execPopulate()
        console.log(savedOrder);
        return res.json(savedOrder)
    } catch (err) {
        console.log(err)
        res.status(400).send({
            message: 'Не удалось создать заказ',
        })
    }
}

module.exports.createWithLogin = async (req, res) => {
    res.send(req.body)
}
