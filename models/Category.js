import mongoose from "mongoose";
import connection from "../config/database.js";

const categorySchema = new mongoose.Schema({
    name: {
        type: String,
    },
    parent: {
        type: String,
        default: '/',
    },
    category: {
        type: String,
        unique: true
    },
    image: {
        type: String,
    }
})

export default connection.model('Category', categorySchema)
