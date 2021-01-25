process.env.NODE_ENV = 'test'

const { before, after } = require('mocha')
const { should } = require('chai')
const superTest = require('supertest')
const mongoose = require('mongoose')

const app = require('../app.js')
const connection = require('../config/database')

should()

const agent = superTest.agent(app)

const { MongoMemoryServer } = require('mongodb-memory-server')
const mongoServer = new MongoMemoryServer()
mongoose.Promise = Promise

async function connectToDB() {
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
                console.log('📛 Failed to connect to test database')
                console.error(err)
            } else {
                console.log('👏 Conected to test database')
            }
        }
    )
}

before(async () => {
    await connectToDB()
})

after(() => {
    connection.close()
})

module.exports.agent = agent
