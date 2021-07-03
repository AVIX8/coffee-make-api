const { describe, it } = require('mocha')
const { agent } = require('./init')
const { getAdminData } = require('./helpers/admin')

const correctUserData = {
    email: 'CategoryQwe1234@gmail.com',
    password: 'qweasdzxc1234',
}

const FRESH_COFFEE_PLATINO = {
    title: 'FRESH COFFEE PLATINO',
    slug: 'FRESH-COFFEE-PLATINO',
    descr: 'Кофе из респ. Гондурас это классический представитель арабики из Центральной Америки. регион: Копан, Окотепеке. Высота произрастания: 1300 - 1500 м. Обладает приятным шоколадным оттенком и сильным телом, хорошей насыщенностью и балансом, идеально подходит для сбалансированного эспрессо.',
    category: '/кофе/моносорта',
    brand: '',
    // imgs: [
    //     "http://c.shld.net/rpx/i/s/i/spin/image/spin_prod_967112812",
    //     "http://c.shld.net/rpx/i/s/i/spin/image/spin_prod_945877912"
    // ],

    properties: {
        кислотность: {
            maxValue: 5,
            value: 3,
        },
        плотность: {
            maxValue: 5,
            value: 2,
        },
    },

    choiceProperty: {
        name: 'Масса (гр)',
        variants: [
            {
                price: 260.0,
                option: 250,
            },
            {
                price: 940.0,
                option: 1000,
            },
        ],
    },
}

const FRESH_COFFEE_GOOD_CUP = {
    title: 'FRESH COFFEE GOOD CUP',
    slug: 'FRESH-COFFEE-GOOD-CUP',
    descr: 'Зерно из Бразилии натуральной (сухой) обработки, регионы: Сан-Паулу (Сантос) и Минас-Жерайс (Минас) растет на высоте 600 - 1300 метров над уровнем моря. Богатый букет, имеющий полный насыщенный вкус, легкий характерный аромат бурбона и долгое послевкусие ореха.',
    category: '/кофе/моносорта',
    brand: '',
    // imgs: [
    //     "http://c.shld.net/rpx/i/s/i/spin/image/spin_prod_967112812",
    //     "http://c.shld.net/rpx/i/s/i/spin/image/spin_prod_945877912"
    // ],

    properties: {
        кислотность: {
            maxValue: 5,
            value: 3,
        },
        плотность: {
            maxValue: 5,
            value: 2,
        },
    },

    choiceProperty: {
        name: 'Масса (гр)',
        variants: [
            {
                price: 320,
                option: 250,
            },
            {
                price: 1150,
                option: 1000,
            },
        ],
    },
}

const productMustExist = async (data) => {
    const adminData = await getAdminData()
    await agent
        .post('/api/products/create')
        .set('Authorization', `Bearer ${adminData.accessToken}`)
        .send(data)
        .expect((res) => {
            res.body //?
        })
}

describe('Products', () => {
    describe('POST /api/products/create', () => {
        it('User can not create product without permission', async () => {
            let accessToken

            await agent.post('/api/auth/register').send(correctUserData)
            await agent
                .post('/api/auth/login')
                .send(correctUserData)
                .expect((res) => {
                    accessToken = res.body.accessToken //?
                })
                .expect(200)

            await agent
                .post('/api/products/create')
                .set('Authorization', `Bearer ${accessToken}`)
                .send(FRESH_COFFEE_PLATINO)
                .expect((res) => {
                    res.body //?
                    res.body.should.be.a('Object')
                    res.body.should.have.property('message')
                    res.body.message.should.be.eq('У вас нет доступа')
                })
                .expect(403)
        })

        it('Admin can create product', async () => {
            const adminData = await getAdminData()

            await agent
                .post('/api/products/create')
                .set('Authorization', `Bearer ${adminData.accessToken}`)
                .send(FRESH_COFFEE_PLATINO)
                .expect((res) => {
                    res.body //?
                    res.body.should.be.a('Object')
                    res.body.should.have.property('_id')
                    res.body.should.have.property('title')
                    res.body.should.have.property('category')
                })
                .expect(200)
        })

        it('Admin can not create a product with already existing slug', async () => {
            const adminData = await getAdminData()

            await agent
                .post('/api/products/create')
                .set('Authorization', `Bearer ${adminData.accessToken}`)
                .send(FRESH_COFFEE_GOOD_CUP)
                .expect((res) => {
                    res.body //?
                })
                .expect(200)

            await agent
                .post('/api/products/create')
                .set('Authorization', `Bearer ${adminData.accessToken}`)
                .send(FRESH_COFFEE_GOOD_CUP)
                .expect((res) => {
                    res.body //?
                    res.body.should.be.a('Object')
                    res.body.should.have.property('message')
                })
                .expect(400)
        })
    })

    describe('POST /api/products/getBySlug', () => {
        it('User can get product by slug', async () => {
            await productMustExist(FRESH_COFFEE_PLATINO)

            await agent
                .post('/api/products/getBySlug')
                .set('Authorization', '')
                .send({ slug: FRESH_COFFEE_PLATINO.slug })
                .expect((res) => {
                    res.body //?
                    res.body.should.have.property('title')
                })
                .expect(200)
        })

        it('User get 404 for non-existent slug', async () => {
            await productMustExist(FRESH_COFFEE_PLATINO)

            await agent
                .post('/api/products/getBySlug')
                .set('Authorization', '')
                .send({ slug: 'non-existent-slug' })
                .expect((res) => {
                    res.body //?
                    res.body.should.have.property('message')
                })
                .expect(404)
        })
    })

    describe('POST /api/products/getByCategory', () => {
        it('User can get products by category', async () => {
            await productMustExist(FRESH_COFFEE_PLATINO)
            await productMustExist(FRESH_COFFEE_GOOD_CUP)

            await agent
                .post('/api/products/getByCategory')
                .set('Authorization', '')
                .send({ category: FRESH_COFFEE_PLATINO.category })
                .expect((res) => {
                    res.body //?
                    res.body.should.be.a('Array')
                    res.body.length.should.be.eq(2)
                })
                .expect(200)
        })

        it('User get 404 for non-existent category', async () => {
            await productMustExist(FRESH_COFFEE_PLATINO)

            await agent
                .post('/api/products/getByCategory')
                .set('Authorization', '')
                .send({ category: 'non/existent/category' })
                .expect((res) => {
                    res.body //?
                    res.body.should.have.property('message')
                })
                .expect(404)
        })
    })
})
