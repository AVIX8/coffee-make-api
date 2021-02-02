var mongoose = require('mongoose')
const dotenv = require('dotenv')

dotenv.config()

let connection = mongoose.createConnection()

console.log(`process.env.NODE_ENV = ${process.env.NODE_ENV}`)

async function getMongoURI() {
    let mongoURI
    if (process.env.NODE_ENV === 'test') {
        mongoose.Promise = Promise
        mongoURI = process.env.WALLABY_MONGO_URI
        if (!mongoURI) {
            const { MongoMemoryServer } = require('mongodb-memory-server')
            const mongoServer = new MongoMemoryServer()
            mongoURI = await mongoServer.getUri('test')
        }
    } else {
        mongoURI = process.env.DB_CONNECT
    }
    return mongoURI
}

(async () => {
    let mongoURI = await getMongoURI()
    console.log(mongoURI)

    connection.openUri(
        mongoURI,
        {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true,
            useFindAndModify: false,
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
})()

module.exports.connection = connection
