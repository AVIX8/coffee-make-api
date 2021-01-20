const chai = require('chai')
const { should } = chai
const superTest = require('supertest')
const { describe, it } = require('mocha')
const app = require('../app.js')

should()

let agent = superTest.agent(app)

describe('Users', () => {
    
    describe('POST /api/user/login', () => {
        it("shouldn't nothing", (done) => {
            agent
                .post('/api/user/login')
                .expect(400)
                .then((res) => {
                    res.body.should.be.a('Object')
                    res.body.should.have.property('message')
                    done()
                }).catch((err) => {
                    done(err)
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
                .then((res) => {
                    res.header['set-cookie'] //?
                    res.body.message //?
                    res.status.should.be.eq(401)
                    res.body.should.be.a('Object')
                    res.body.should.have.property('id')
                    console.log(res.body.id)
                    done()
                }).catch((err) => {
                    done(err)
                })
        })
    })
})
