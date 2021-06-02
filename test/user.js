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
    describe('POST /api/auth/register', () => {
        it('Failed to register with invalid user data', async () => {
            await agent
                .post('/api/auth/register')
                .send(invalidUserData)
                .expect((res) => {
                    res.body //?
                    res.body.should.be.a('Object')
                    res.body.should.have.property('message')
                    // res.body.message.should.be.eq(
                    //     '"email" must be a valid email'
                    // )
                })
                .expect(400)
        })

        it('Successful user registration', async () => {
            await agent
                .post('/api/auth/register')
                .send(correctUserData)
                .expect((res) => {
                    res.body //?
                    res.body.should.be.a('Object')
                    res.body.should.have.property('id')
                })
                .expect(200)
        })

        it('Failed to register an already registered user', async () => {
            await agent.post('/api/auth/register').send(correctUserData)
            await agent
                .post('/api/auth/register')
                .send(correctUserData)
                .expect((res) => {
                    res.body //?
                    res.body.should.be.a('Object')
                    res.body.should.have.property('message')
                    res.body.message.should.be.eq(
                        'Пользователь с данным адресом электронной почты уже зарегистрирован'
                    )
                })
                .expect(400)
        })
    })

    describe('POST /api/auth/login', () => {
        it('Failed to login without user data', async () => {
            await agent
                .post('/api/auth/login')
                .expect((res) => {
                    res.body //?
                    res.body.should.be.a('Object')
                    res.body.should.have.property('message')
                    // res.body.message.should.be.eq(
                    //     '"email" is required'
                    // )
                })
                .expect(400)
        })

        it('Failed to login with incorrect user data', async () => {
            await agent
                .post('/api/auth/login')
                .send(incorrectUserData)
                .expect((res) => {
                    res.body //?
                    res.body.should.be.a('Object')
                    res.body.should.have.property('message')
                    res.body.message.should.be.eq(
                        'Пароль или адрес электронной почты неверны'
                    )
                })
                .expect(403)
        })

        it('Successful login', async () => {
            await agent
                .post('/api/auth/login')
                .send(correctUserData)
                .expect((res) => {
                    res.body //?
                    res.body.should.be.a('Object')
                    res.body.should.have.property('accessToken')
                    res.body.should.have.property('refreshToken')
                })
                .expect(200)
        })
    })

    describe('GET /api/user/getUserData', () => {
        it('Failed (unauthorized)', async () => {
            await agent
                .get('/api/user/getUserData')
                .set('Authorization', '')
                .expect((res) => {
                    res.body //?
                    res.body.should.be.a('Object')
                })
                .expect(401)
        })

        it('Successfully get user data', async () => {
            let accessToken, refreshToken
            await agent.post('/api/auth/register').send(correctUserData)

            await agent
                .post('/api/auth/login')
                .send(correctUserData)
                .expect((res) => {
                    refreshToken = res.body.refreshToken
                })
                .expect(200)

            await agent
                .post('/api/auth/logout')
                .send({ refreshToken })
                .expect(200)

            await agent
                .post('/api/auth/login')
                .send(correctUserData)
                .expect((res) => {
                    res.body //?
                    accessToken = res.body.accessToken
                })
                .expect(200)

            // console.log(accessToken)

            await agent
                .set('Authorization', `Bearer ${accessToken}`)
                .get('/api/user/getUserData')
                .expect((res) => {
                    res.body //?
                    res.body.should.be.a('Object')
                })
                .expect(200)
        })
    })
})
