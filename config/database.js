var mongoose = require('mongoose')
const dotenv = require('dotenv')
// const sp = require('synchronous-promise')

dotenv.config()

let connection

console.log(process.env.NODE_ENV)
if (process.env.NODE_ENV === 'test') {
    var Mockgoose = require('mockgoose').Mockgoose
    var mockgoose = new Mockgoose(mongoose)

    mockgoose.prepareStorage()
    
    connection = mongoose.createConnection(
        process.env.DB_CONNECT,
        {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true,
        },
        (err) => {
            if (err) {
                console.log('😡 Failed to connect to database')
                console.error(err)
            } else {
                console.log('👏 Conected to db')
            }
        }
    )
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
                console.log('😡 Failed to connect to database')
                console.error(err)
            } else {
                console.log('👏 Conected to db')
            }
        }
    )
}

module.exports = connection
