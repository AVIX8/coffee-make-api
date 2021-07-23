const mongoose = require('mongoose')
const orderSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
    },
    fullName: {
        type: 'String',
    },
    phone: {
        type: 'String',
    },
    address: {
        type: 'String',
    },
    cart: {
        type: [{ type: Object }],
    },
    status: {
        type: 'String',
    },
    date: {
        type: Date,
        default: Date.now(),
    },
})

module.exports = mongoose.model('Order', orderSchema)
