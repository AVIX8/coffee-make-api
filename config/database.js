var mongoose = require('mongoose')
const dotenv = require('dotenv')

dotenv.config()

let connection

console.log(process.env.NODE_ENV)
if (process.env.NODE_ENV === 'test') {
    connection = mongoose.createConnection()
} else {
    connection = mongoose.createConnection(
        process.env.DB_CONNECT,
        {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true,
        },
        (err) => {
            if (err) {
                console.log('📛 Failed to connect to database')
                console.error(err)
            } else {
                console.log('👏 Conected to database')
            }
        }
    )
}

module.exports = connection
