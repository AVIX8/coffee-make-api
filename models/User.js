import connection from '../config/database.js'
import mongoose from 'mongoose'
import passportLocalMongoose from "passport-local-mongoose";

const userSchema = new mongoose.Schema({
    hash: { // for passport-local-mongoose
        type: String,
    },
    salt: { // for passport-local-mongoose
        type: String
    },
    email: {
        type: String,
        required: true,
        max: 255,
    },
    name: {
        type: String,
        max: 255,
    },
    date: {
        type: Date,
        default: Date.now(),
    },
})

userSchema.plugin(passportLocalMongoose, { usernameField : 'email' });

export default connection.model('User', userSchema)
