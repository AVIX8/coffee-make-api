const { describe, it } = require('mocha')
const { agent } = require('./init')
const { getAdmin } = require('./helpers/admin')

describe('Categories', () => {
    describe('POST /api/categories/create', () => {
        it('Failed to create category witout permission', async () => {
            await agent
                .post('/api/categories/create')
                .send({
                    name: 'новая категория 47',
                })
                .expect((res) => {
                    res.body //?
                    res.body.should.be.a('Object')
                    res.body.should.have.property('message')
                    res.body.message.should.be.eq('Вы не администратор')
                })
                .expect(401)
        })

        it('Successfully create category', async () => {
            let { data } = await getAdmin()
            await agent.post('/api/user/login').send(data).expect(200)

            await agent
                .post('/api/categories/create')
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

        it('Successfully get categories by parentId', async () => {
            let { body: coffee } = await agent
                .post('/api/categories/create')
                .send({
                    name: 'Кофе',
                })
                .expect(200)

            coffee //?

            await agent
                .post('/api/categories/create')
                .send({
                    name: 'Эспрессо смеси',
                    parentId: coffee._id,
                })
                .expect(200)

            await agent
                .post('/api/categories/create')
                .send({
                    name: 'Моносорта',
                    parentId: coffee._id,
                })
                .expect(200)

            await agent
                .post('/api/categories')
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
