import mongoose from 'mongoose'
import connection from "../config/database.js";

const productSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        min: 3,
        max: 255,
    },
    venderCode: {
        type: String,
        required: true,
        unique: true,
        min: 3,
        max: 255,
    },
    price: {
        type: Number
    },
    images: {
        type: [String]
    }

})

export default connection.model('Product', productSchema)
