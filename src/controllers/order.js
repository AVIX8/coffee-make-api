const Product = require('../models/Product.js')

const messages = require('../messages.js')

async function getValidCart(cart) {

    return new Promise((resolve, reject) => {
        if (!cart?.length)
            return reject(messages.cartIsRequired)

        Promise.all(cart.map(async (x) => {
            let product = await Product.findById(x._id)
            if (x.optionValue == null) {
                return product
            }
        })).then((products) => {
            console.log(products);
        }).catch(() => {
            return reject(messages.invalidProduct)
        })
    });
}

module.exports.get = async (req, res) => {}

module.exports.create = async (req, res) => {
    console.log(req.body)
    try {
        await getValidCart(req.body.cart)
    } catch (error) {
        res.status(400).send({ message: error })
    }
    res.status(200).send()
}

module.exports.createWithLogin = async (req, res) => {}
