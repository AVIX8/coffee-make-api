var mongoose = require('mongoose')
const dotenv = require('dotenv')

dotenv.config()

let connection

console.log(process.env.NODE_ENV)
if (process.env.NODE_ENV === 'test') {
    connection = mongoose.createConnection()
    const { MongoMemoryServer } = require('mongodb-memory-server')
    const mongoServer = new MongoMemoryServer()
    mongoose.Promise = Promise
    process.nextTick(async () => {
        let mongoUri = process.env.WALLABY_MONGO_URI
        if (!mongoUri) {
            mongoUri = await mongoServer.getUri('test')
        }
        await connection.openUri(
            mongoUri,
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
                    console.log('👏 Conected to db')
                }
            }
        )
    })
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
                console.log('👏 Conected to db')
            }
        }
    )
}

module.exports = connection
