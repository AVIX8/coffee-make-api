const { Router } = require( 'express')
const router = Router()

const authRoute = require('./auth')
const userRoute = require('./user')
const categoryRoute = require('./categories')
const productsRoute = require('./products')
const ordersRoute = require('./orders')
const storageRoute = require('./storage')

router.use('/auth', authRoute)
router.use('/user', userRoute)
router.use('/categories', categoryRoute)
router.use('/products', productsRoute)
router.use('/orders', ordersRoute)
router.use('/storage', storageRoute)

module.exports = router