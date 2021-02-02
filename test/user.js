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
        it('Failed to register with invalid user data', async () => {
            await agent
                .post('/api/user/register')
                .send(invalidUserData)
                .expect(400)
                .expect((res) => {
                    res.header['set-cookie'] //?
                    res.body //?
                    res.body.should.be.a('Object')
                    res.body.should.have.property('message')
                    // res.body.message.should.be.eq(
                    //     '"email" must be a valid email'
                    // )
                })
        })

        it('Successful user registration', async () => {
            await agent
                .post('/api/user/register')
                .send(correctUserData)
                .expect(200)
                .expect((res) => {
                    res.header['set-cookie'] //?
                    res.body //?
                    res.body.should.be.a('Object')
                    res.body.should.have.property('id')
                })
        })

        it('Failed to register an already registered user', async () => {
            await agent
                .post('/api/user/register')
                .send(correctUserData)
                .expect(400)
                .expect((res) => {
                    res.header['set-cookie'] //?
                    res.body //?
                    res.body.should.be.a('Object')
                    res.body.should.have.property('message')
                    res.body.message.should.be.eq(
                        'Пользователь с данным адресом электронной почты уже зарегистрирован'
                    )
                })
        })
    })

    describe('POST /api/user/login', () => {
        it('Failed to login without user data', async () => {
            await agent
                .post('/api/user/login')
                .expect(400)
                .expect((res) => {
                    res.header['set-cookie'] //?
                    res.body //?
                    res.body.should.be.a('Object')
                    res.body.should.have.property('message')
                    // res.body.message.should.be.eq(
                    //     '"email" is required'
                    // )
                })
        })

        it('Failed to login with incorrect user data', async () => {
            await agent
                .post('/api/user/login')
                .send(incorrectUserData)
                .expect(400)
                .expect((res) => {
                    res.header['set-cookie'] //?
                    res.body //?
                    res.body.should.be.a('Object')
                    res.body.should.have.property('message')
                    res.body.message.should.be.eq(
                        'Пароль или адрес электронной почты неверны'
                    )
                })
        })

        it('Successful login', async () => {
            await agent
                .post('/api/user/login')
                .send(correctUserData)
                .expect(200)
                .expect((res) => {
                    res.header['set-cookie'] //?
                    res.body //?
                    res.body.should.be.a('Object')
                    res.body.should.have.property('id')
                })
        })
    })

    describe('GET /api/user/getUserData', () => {
        it('Failed (unauthorized)', async () => {
            let logout = await agent.get('/api/user/logout').expect(200)
            logout.body //?

            await agent
                .get('/api/user/getUserData')
                .expect(401)
                .expect((res) => {
                    res.header['set-cookie'] //?
                    res.body //?
                    res.body.should.be.a('Object')
                })
        })

        it('Successfully get user data', async () => {
            await agent.get('/api/user/logout').expect(200)

            await agent
                .post('/api/user/login')
                .send(correctUserData)
                .expect(200)

            await agent
                .get('/api/user/getUserData')
                .expect(200)
                .expect((res) => {
                    res.header['set-cookie'] //?
                    res.body //?
                    res.body.should.be.a('Object')
                })
        })
    })
})
