const { describe, it } = require('mocha')
const { agent } = require('./init')
const { getAdminData } = require('./helpers/admin')

const correctUserData = {
    email: 'CategoryQwe1234@gmail.com',
    password: 'qweasdzxc1234',
}

const FRESH_COFFEE_1 = {
    title: 'FRESH COFFEE 1',
    slug: 'FRESH-COFFEE-1',
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

const FRESH_COFFEE_2 = {
    title: 'FRESH COFFEE 2',
    slug: 'FRESH-COFFEE-2',
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

const createCategory = async (data) => {
    const adminData = await getAdminData()
    let { body: category } = await agent
        .post('/api/categories/create')
        .set('Authorization', `Bearer ${adminData.accessToken}`)
        .send(data)
        .expect((res) => {
            res.body //?
        })
    return category
}

const createProduct = async (data) => {
    const adminData = await getAdminData()
    let { body: product } = await agent
        .post('/api/products/create')
        .set('Authorization', `Bearer ${adminData.accessToken}`)
        .send(data)
        .expect((res) => {
            res.body //?
        })
    return product
}

describe('Categories', () => {
    describe('POST /api/categories/create', () => {
        it('User can not create category witout permission', async () => {
            let accessToken

            await agent.post('/api/auth/register').send(correctUserData)
            await agent
                .post('/api/auth/login')
                .send(correctUserData)
                .expect((res) => {
                    accessToken = res.body.accessToken
                })
                .expect(200)

            await agent
                .post('/api/categories/create')
                .set('Authorization', `Bearer ${accessToken}`)
                .send({
                    title: 'новая категория 47',
                })
                .expect((res) => {
                    res.body //?
                    res.body.should.be.a('Object')
                    res.body.should.have.property('message')
                    res.body.message.should.be.eq('У вас нет доступа')
                })
                .expect(403)
        })

        it('Admin can create category', async () => {
            const adminData = await getAdminData()

            await agent
                .post('/api/categories/create')
                .set('Authorization', `Bearer ${adminData.accessToken}`)
                .send({
                    title: 'новая категория 47',
                })
                .expect((res) => {
                    res.body //?
                    res.body.should.be.a('Object')
                    res.body.should.have.property('_id')
                    res.body.should.have.property('title')
                    res.body.should.have.property('parent')
                    res.body.should.have.property('path')
                })
                .expect(200)
        })

        it('Admin can create subcategory by parentId', async () => {
            const adminData = await getAdminData()

            let category1 = await createCategory({
                title: 'категория 1',
            })
            category1 //?

            await agent
                .post('/api/categories/create')
                .set('Authorization', `Bearer ${adminData.accessToken}`)
                .send({
                    title: 'категория 2',
                    parentId: category1._id,
                })
                .expect((res) => {
                    res.body //?
                    res.body.should.be.a('Object')
                    res.body.should.have.property('_id')
                    res.body.should.have.property('title')
                    res.body.should.have.property('parent')
                    res.body.should.have.property('path')
                })
                .expect(200)
        })
    })

    describe('POST /api/categories', () => {
        it('User can get subcategories by parentPath', async () => {
            let { _id } = await createCategory({ title: 'lolar' })
            await createCategory({ title: 'q', parentId: _id })
            await createCategory({ title: 'w', parentId: _id })
            await createCategory({ title: 'e', parentId: _id })

            await agent
                .post('/api/categories')
                .send({ parentPath: '/lolar' })
                .expect((res) => {
                    res.body //?
                    res.body.should.be.a('Array')
                    res.body.length.should.be.eq(3)
                })
                .expect(200)
        })

        it('User get empty Array for invalid parentPath', async () => {
            await agent
                .post('/api/categories')
                .send({ parentPath: 'lolar/komar/omar' })
                .expect((res) => {
                    res.body //?
                    res.body.should.be.a('Array')
                    res.body.length.should.be.eq(0)
                })
                .expect(200)
        })
    })

    describe('POST /api/categories/update', () => {
        it('Admin can update category with products', async () => {
            let cat1 = await createCategory({title: 'level1' })
            let cat2 = await createCategory({title: 'level2', parentId: cat1._id})
            let cat3 = await createCategory({title: 'level3', parentId: cat2._id}) //?

            
            let product2 = await createProduct({
                title: 'categotyUpdateTest2',
                slug: 'categoty-update-test2',
                category: cat2.path,
            }) //?
            
            let product3 = await createProduct({
                title: 'categotyUpdateTest3',
                slug: 'categoty-update-test3',
                category: cat3.path,
            }) //?
            
            const adminData = await getAdminData()
            await agent
                .post('/api/categories/update')
                .set('Authorization', `Bearer ${adminData.accessToken}`)
                .send({ id: cat2._id, title: 'newLevel' })
                .expect(200)

            await agent
                .post('/api/categories')
                .set('Authorization', '')
                .send({ parentPath: '/level1/newLevel' })
                .expect((res) => {
                    res.body //?
                    res.body[0].path.should.be.eq('/level1/newLevel/level3')
                })
                .expect(200)

            await agent
                .post('/api/products/getBySlug')
                .send({ slug: product2.slug })
                .expect((res) => {
                    res.body //?
                    res.body.category.should.be.eq('/level1/newLevel')
                })
                .expect(200)
            
            await agent
                .post('/api/products/getBySlug')
                .send({ slug: product3.slug })
                .expect((res) => {
                    res.body //?
                    res.body.category.should.be.eq('/level1/newLevel/level3')
                })
                .expect(200)
        })
    })



    describe('POST /api/categories/getProducts', () => {
        it('User get 404 for non-existent category', async () => {
            const category = '/non/existent/category'

            await agent
                .post('/api/categories/getProducts')
                .send({ category })
                .expect((res) => {
                    res.body //?
                    res.body.should.be.a('Object')
                    res.body.should.have.property('message')
                    res.body.message.should.be.eq('Не удалось найти товары')
                })
                .expect(404)
        })

        it('User can get products by category', async () => {
            let { _id } = await createCategory({ title: 'parentCategory' })
            let category = await createCategory({
                title: 'subCategory',
                parentId: _id,
            })

            category //? 

            await createProduct({ ...FRESH_COFFEE_1, category: category.path }) //?
            await createProduct({ ...FRESH_COFFEE_2, category: category.path }) //?

            await agent
                .post('/api/categories/getProducts')
                .send({ path: category.path })
                .expect((res) => {
                    res.body //?
                    res.body.should.be.a('Array')
                    res.body.length.should.be.eq(2)
                })
                .expect(200)
        })

        it('User can get all products in category subtree', async  () => {
            let cat1 = await createCategory({title: 'subtree-level1' })
            let cat2 = await createCategory({title: 'subtree-level2', parentId: cat1._id})
            let cat3 = await createCategory({title: 'subtree-level3', parentId: cat2._id})

            await createProduct({
                title: 'categotySubtreeTest2',
                slug: 'categoty-subtree-test2',
                category: cat2.path,
            }) //?
            
            await createProduct({
                title: 'categotySubtreeTest3',
                slug: 'categoty-subtree-test3',
                category: cat3.path,
            }) //?

            await agent
                .post('/api/categories/getProducts')
                .send({ path: cat1.path, all: true })
                .expect((res) => {
                    res.body //?
                    res.body.should.be.a('Array')
                    res.body.length.should.be.eq(2)
                })
                .expect(200)
        })
    })
})
