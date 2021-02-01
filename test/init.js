process.env.NODE_ENV = 'test'

const { before, after } = require('mocha')
const { should } = require('chai')
const superTest = require('supertest')

const app = require('../app.js')
const { connection } = require('../src/config/database')

should()

const agent = superTest.agent(app)

before((done) => {
    connection.once('open', () => {
        setImmediate( () => {
            done()
        })
    })
})

after(() => {
    connection.close()
})

module.exports.agent = agent
