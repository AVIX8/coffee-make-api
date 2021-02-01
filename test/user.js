const { describe, it } = require('mocha')
const { agent } = require('./init')

const invalidUserData = {
    email: 'qwe1234',
    password: 'qweasdzxc1234',
}

const correctUserData = {
    email: 'qwe1234@gmail.com',
    password: 'qweasdzxc1234',
}

const incorrectUserData = {
    email: 'qwe1234@gmail.com',
    password: 'qweasdzxc123',
}

describe('Users', () => {
    describe('POST /api/user/register', () => {
        it('Failed to register with invalid user data', (done) => {
            agent
                .post('/api/user/register')
                .send(invalidUserData)
                .expect(400)
                .end((err, res) => {
                    res.header['set-cookie'] //?
                    res.body //?
                    res.body.should.be.a('Object')
                    res.body.should.have.property('message')
                    // res.body.message.should.be.eq(
                    //     '"email" must be a valid email'
                    // )
                    done(err)
                })
        })

        it('Successful user registration', (done) => {
            agent
                .post('/api/user/register')
                .send(correctUserData)
                .expect(200)
                .end((err, res) => {
                    res.header['set-cookie'] //?
                    res.body //?
                    res.body.should.be.a('Object')
                    res.body.should.have.property('id')
                    done(err)
                })
        })

        it('Failed to register an already registered user', (done) => {
            agent
                .post('/api/user/register')
                .send(correctUserData)
                .expect(400)
                .end((err, res) => {
                    res.header['set-cookie'] //?
                    res.body //?
                    res.body.should.be.a('Object')
                    res.body.should.have.property('message')
                    res.body.message.should.be.eq(
                        'Пользователь с данным адресом электронной почты уже зарегистрирован'
                    )
                    done(err)
                })
        })
    })

    describe('POST /api/user/login', () => {
        it('Failed to login without user data', (done) => {
            agent
                .post('/api/user/login')
                .expect(400)
                .end((err, res) => {
                    res.header['set-cookie'] //?
                    res.body //?
                    res.body.should.be.a('Object')
                    res.body.should.have.property('message')
                    // res.body.message.should.be.eq(
                    //     '"email" is required'
                    // )
                    done(err)
                })
        })

        it('Failed to login with incorrect user data', (done) => {
            agent
                .post('/api/user/login')
                .send(incorrectUserData)
                .expect(400)
                .end((err, res) => {
                    res.header['set-cookie'] //?
                    res.body //?
                    res.body.should.be.a('Object')
                    res.body.should.have.property('message')
                    res.body.message.should.be.eq(
                        'Пароль или адрес электронной почты неверны'
                    )
                    done(err)
                })
        })

        it('Successful login', function (done) {
            agent
                .post('/api/user/login')
                .send(correctUserData)
                .expect(200)
                .end((err, res) => {
                    res.header['set-cookie'] //?
                    res.body.message //?
                    res.body.should.be.a('Object')
                    res.body.should.have.property('id')
                    done(err)
                })
        })
    })

    describe('GET /api/user/getUserData', () => {
        it('Failed (unauthorized)', (done) => {
            agent
                .get('/api/user/logout')
                .expect(200)
                .end((err, res) => {
                    res.body //?
                    agent
                        .get('/api/user/getUserData')
                        .expect(401)
                        .end((err, res) => {
                            res.header['set-cookie'] //?
                            res.body //?
                            res.body.should.be.a('Object')
                            done(err)
                        })
                })
        })

        it('Successfully get user data', (done) => {
            agent.get('/api/user/logout').end((err, res) => {
                res.body //?
                agent
                    .post('/api/user/login')
                    .send(correctUserData)
                    .expect(200)
                    .end((err, res) => {
                        res.header['set-cookie'] //?
                        res.body //?
                        agent
                            .get('/api/user/getUserData')
                            .expect(200)
                            .end((err, res) => {
                                res.header['set-cookie'] //?
                                res.body //?
                                res.body.should.be.a('Object')
                                done(err)
                            })
                    })
            })
        })
    })
})
