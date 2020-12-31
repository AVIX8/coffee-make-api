import mongoose from "mongoose";
import connection from "../config/database.js";

const categorySchema = new mongoose.Schema({
    name: {
        type: String,
    },
    parent: {
        type: String,
    },
    category: {
        type: String,
    }
})

module.exports = connection.model('Category', categorySchema)
