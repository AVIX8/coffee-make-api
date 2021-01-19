const mongoose = require('mongoose')
const dotenv = require('dotenv')

dotenv.config()

const connection = mongoose.connect(
    process.env.DB_CONNECT,
    { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true },
    (err) => {
        if (err) {
            console.log('😡 Failed to connect to database')
            console.error(err)
        } else {
            console.log('👏 Conected to db')
        }
    }
)

module.exports.default = connection
