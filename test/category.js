const { describe, it } = require('mocha')
const { agent } = require('./init')
const { getAdminData } = require('./helpers/admin')

const correctUserData = {
    email: 'CategoryQwe1234@gmail.com',
    password: 'qweasdzxc1234',
}

describe('Categories', () => {
    describe('POST /api/categories/create', () => {
        it('Failed to create category witout permission', async () => {
            let accessToken
            
            await agent.post('/api/auth/register').send(correctUserData)
            await agent.post('/api/auth/login').send(correctUserData).expect((res) => {
                accessToken = res.body.accessToken
            }).expect(200)

            await agent
                .post('/api/categories/create')
                .set("Authorization", `Bearer ${accessToken}`)
                .send({
                    name: 'новая категория 47',
                })
                .expect((res) => {
                    res.body //?
                    res.body.should.be.a('Object')
                    res.body.should.have.property('message')
                    res.body.message.should.be.eq('У вас нет доступа')
                })
                .expect(403)
        })

        it('Successfully create category', async () => {
            let accessToken
            const adminData = await getAdminData()
            await agent.post('/api/auth/register').send(adminData)
            await agent.post('/api/auth/login').send(adminData).expect((res) => {
                res.body //?
                accessToken = res.body.accessToken
            }).expect(200)

            await agent
                .post('/api/categories/create')
                .set("Authorization", `Bearer ${accessToken}`)
                .send({
                    name: 'новая категория 47',
                })
                .expect((res) => {
                    res.body //?
                    res.body.should.be.a('Object')
                    res.body.should.have.property('_id')
                    res.body.should.have.property('name')
                    res.body.should.have.property('parent')
                    res.body.should.have.property('category')
                })
                .expect(200)
        })
    })

    describe('POST /api/categories', () => {
        it('Successfully get categories by parentPath', async () => {
            await agent
                .post('/api/categories')
                .send({ parentPath: '' })
                .expect((res) => {
                    res.body //?
                    res.body.should.be.a('Object')
                    res.body.should.have.property('categories')
                    res.body.categories.should.be.a('Array')
                })
                .expect(200)
        })

        it('Successfully create categories by parentId', async () => {
            let accessToken
            const adminData = await getAdminData()
            await agent.post('/api/auth/register').send(adminData)
            await agent.post('/api/auth/login').send(adminData).expect((res) => {
                res.body //?
                accessToken = res.body.accessToken
            }).expect(200)

            let { body: coffee } = await agent
                .post('/api/categories/create')
                .set("Authorization", `Bearer ${accessToken}`)
                .send({
                    name: 'Кофе',
                })
                .expect(200)

            coffee //?

            await agent
                .post('/api/categories/create')
                .set("Authorization", `Bearer ${accessToken}`)
                .send({
                    name: 'Эспрессо смеси',
                    parentId: coffee._id,
                })
                .expect(200)

            await agent
                .post('/api/categories/create')
                .set("Authorization", `Bearer ${accessToken}`)
                .send({
                    name: 'Моносорта',
                    parentId: coffee._id,
                })
                .expect(200)

            await agent
                .post('/api/categories')
                .set("Authorization", `Bearer ${accessToken}`)
                .send({ parentId: coffee._id })
                .expect((res) => {
                    res.body //?
                    res.body.should.be.a('Object')
                    res.body.should.have.property('categories')
                    res.body.categories.should.be.a('Array')
                    res.body.categories.should.have.length(2)
                })
                .expect(200)
        })

        it('Failed to get categories by invalid parentId', async () => {
            await agent
                .post('/api/categories')
                .send({ parentId: '5ff323a40db1542dc0e4c793' })
                .expect((res) => {
                    res.body //?
                    res.body.should.be.a('Object')
                    res.body.should.have.property('message')
                    res.body.message.should.be.eq(
                        'неверный идентификатор категории'
                    )
                })
                .expect(400)
        })
    })
})
