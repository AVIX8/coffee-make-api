process.env.NODE_ENV = 'test'
const chai = require('chai')
const { should } = chai
const superTest = require('supertest')
const { describe, it, before, after } = require('mocha')
const app = require('../app.js')
const connection = require('../config/database')

should()

let agent = superTest.agent(app)

before((done) => {
    connection.on('open', () => done())
})

after(() => {
    connection.close()
})

describe('Categories', () => {  

    describe('POST /api/categories', () => {
        it('ERROR, create categoriy witout permission', (done) => {
            agent
                .post('/api/categories/create')
                .send({
                    name: 'НовоеКофе14',
                })
                .then((res) => {
                    res.statusCode //?
                    res.body //?
                    res.body.should.be.a('Object')
                    res.body.should.have.property('message')
                    res.body.message.should.be.eq('Вы не администратор')
                    done()
                }).catch((err) => {
                    done(err)
                })
        })

        it('OK, get categories by parentPath', (done) => {
            agent
                .post('/api/categories')
                .send({ parentPath: '/кофе' })
                .then((res) => {
                    res.statusCode //?
                    res.body //?
                    res.body.should.be.a('Object')
                    res.body.should.have.property('categories')
                    res.body.categories.should.be.a('Array')
                    done()
                }).catch((err) => {
                    done(err)
                })
        })

        it('OK, get categories by parentId', (done) => {
            agent
                .post('/api/categories')
                .send({ parentId: '5ff323a40db1542dc0e4c792' })
                .then((res) => {
                    res.statusCode //?
                    res.body //?
                    res.body.should.be.a('Object')
                    res.body.should.have.property('categories')
                    res.body.categories.should.be.a('Array')
                    done()
                }).catch((err) => {
                    done(err)
                })
        })

        it(' get error by invalid parentId', (done) => {
            agent
                .post('/api/categories')
                .send({ parentId: '5ff323a40db1542dc0e4c793' })
                .then((res) => {
                    res.statusCode //?
                    res.body //?
                    res.body.should.be.a('Object')
                    res.body.should.have.property('message')
                    res.body.message.should.be.eq('invalid category id')
                    done()
                })
                .catch((err) => {
                    done(err)
                })
        })
    })
})
