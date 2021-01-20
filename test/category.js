process.env.NODE_ENV = 'test'
const chai = require('chai')
const superTest = require('supertest')
const { describe, it, before, beforeEach } = require('mocha')
const app = require('../app.js')
const connection = require('../config/database')

let agent = superTest.agent(app)

describe('Categories', () => {
    before((done) => {
        connection.once('open', () => {
            done()
        })
    })

    describe('POST /api/categories', () => {
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
                })
        })

        // it(' get error by invalid parentId', (done) => {
        //     agent
        //         .post('/api/categories')
        //         .send({ parentId: 'thisIdDoesntExist' })
        //         .then((res) => {
        //             res.statusCode //?
        //             res.body //?
        //             res.body.should.be.a('Object')
        //             res.body.should.have.property('categories')
        //             res.body.categories.should.be.a('Array')
        //             done()
        //         })
        //         .catch((err) => {
        //             done(err)
        //         })
        // })
    })
})
