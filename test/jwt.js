const { describe, it } = require('mocha')
const { agent } = require('./init')
const jwt = require('jsonwebtoken')

const correctUserData = {
    email: 'SessionQwe1234@gmail.com',
    password: 'SessionQweasdzxc1234',
}

const incorrectUserData = {
    email: 'SessionQwe1234@gmail.com',
    password: 'qweasdzxc123',
}

describe('JWT', () => {
    describe('POST /api/auth/login', () => {
        it('User can succesfully login', async () => {
            await agent.post('/api/auth/register').send(correctUserData)

            await agent
                .post('/api/auth/login')
                .send(correctUserData)
                .expect((res) => {
                    res.body //?
                })
                .expect(200)
        })

        it('User gets 403 on invalid credentials', async () => {
            await agent
                .post('/api/auth/login')
                .send(incorrectUserData)
                .expect(403)
        })

        it('User receives 401 on expired token', async () => {
            const accessToken = jwt.sign(
                correctUserData,
                process.env.JWT_SECRET_KEY,
                { expiresIn: '1ms' }
            )
            await agent
                .set('Authorization', `Bearer ${accessToken}`)
                .get('/api/user/getUserData')
                .expect(401)
        })
    })

    describe('POST /api/auth/refresh', () => {
        it('User can get new access token using refresh token', async () => {
            await agent.post('/api/auth/register').send(correctUserData)
            const accessToken = jwt.sign(
                correctUserData,
                process.env.JWT_SECRET_KEY,
                { expiresIn: '1ms' }
            )

            let refreshToken
            await agent
                .post('/api/auth/login')
                .send(correctUserData)
                .expect((res) => {
                    res.body //?
                    refreshToken = res.body.refreshToken
                })
                .expect(200)

            await agent // accessToken expired
                .set('Authorization', `Bearer ${accessToken}`)
                .get('/api/user/getUserData')
                .expect(401)

            let newAccessToken
            await agent
                .post('/api/auth/refresh')
                .send({ refreshToken })
                .expect((res) => {
                    res.body //?
                    res.body.should.have.property('accessToken')
                    res.body.should.have.property('refreshToken')
                    newAccessToken = res.body.accessToken
                })
                .expect(200)

            await agent
                .set('Authorization', `Bearer ${newAccessToken}`)
                .get('/api/user/getUserData')
                .expect(200)
        })

        it('User get 404 on invalid refresh token', async () => {
            const invalidResfreshToken = '6ff36bc2-2da8-40a9-a350-50ec40f33fce'
            await agent
                .post('/api/auth/refresh')
                .send({ refreshToken: invalidResfreshToken })
                .expect((res) => {
                    res.body //?
                })
                .expect(404)
        })

        it('User can use refresh token only once', async () => {
            await agent.post('/api/auth/register').send(correctUserData)

            let refreshToken
            await agent
                .post('/api/auth/login')
                .send(correctUserData)
                .expect((res) => {
                    res.body //?
                    refreshToken = res.body.refreshToken
                })
                .expect(200)

            await agent
                .post('/api/auth/refresh')
                .send({ refreshToken })
                .expect(200)
            await agent
                .post('/api/auth/refresh')
                .send({ refreshToken })
                .expect(404)
        })

        it('Multiple refresh tokens are valid', async () => {
            let refreshToken1, refreshToken2
            await agent
                .post('/api/auth/login')
                .send(correctUserData)
                .expect((res) => {
                    res.body //?
                    refreshToken1 = res.body.refreshToken
                })
                .expect(200)

            await agent
                .post('/api/auth/login')
                .send(correctUserData)
                .expect((res) => {
                    res.body //?
                    refreshToken2 = res.body.refreshToken
                })
                .expect(200)

            await agent
                .post('/api/auth/refresh')
                .send({ refreshToken: refreshToken1 })
                .expect(200)
            await agent
                .post('/api/auth/refresh')
                .send({ refreshToken: refreshToken2 })
                .expect(200)
        })
    })

    describe('POST /api/auth/logout', () => {
        it('Refresh tokens become invalid on logout', async () => {
            let refreshToken
            await agent
                .post('/api/auth/login')
                .send(correctUserData)
                .expect((res) => {
                    res.body //?
                    refreshToken = res.body.refreshToken
                })
                .expect(200)

            await agent
                .post('/api/auth/logout')
                .send({ refreshToken })
                .expect(200)
            await agent
                .post('/api/auth/refresh')
                .send({ refreshToken })
                .expect(404)
        })
    })
})
