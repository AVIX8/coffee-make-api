const chai = require('chai')
const { should } = chai
const superTest = require('supertest')
const { describe, it, before } = require('mocha')
const app = require('../app.js')
const connection = require('../config/database')

should()

let agent = superTest.agent(app)

describe('Users', () => {
    // before((done) => {
    //     connection.on('open', () => {
    //         done()
    //     })
    // })

    /**
     * testing the /login route
     */
    describe('POST /api/user/login', () => {
        it("shouldn't nothing", (done) => {
            agent
                .post('/api/user/login')
                .expect(400)
                .then((res) => {
                    res.body.should.be.a('Object')
                    res.body.should.have.property('message')
                    done()
                })
        })

        it('should login user and send him his id', function (done) {
            const body = {
                email: 'qwe1234@gmail.com',
                password: 'qweasdzxc1234',
            }
            agent
                .post('/api/user/login')
                .send(body)
                .end((err, res) => {
                    res.header['set-cookie'] //?
                    res.body.message //?
                    res.status.should.be.eq(200)
                    res.body.should.be.a('Object')
                    res.body.should.have.property('id')
                    console.log(res.body.id)
                    return done()
                })
        })
    })
})
