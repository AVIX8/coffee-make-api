import mongoose from 'mongoose'
import connection from '../config/database.js'

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    slug: {
        type: String,
        required: true,
        unique: true,
    },
    desc: {
        type: String,
    },
    brand: {
        type: String,
    },
    imgs: {
        type: [String],
    },
    properties: {
        type: Object
    },
    choiceProperty: {
        type: Object,
    },
})

export default connection.model('Product', productSchema)
