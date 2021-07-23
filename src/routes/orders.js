const { Router } = require( 'express')
const { isAuth } = require('../middlewares/auth')

const { get, create, createWithLogin } = require('../controllers/order')

const router = Router()


router.post('/getInfo', get)

router.post('/create', create)
router.post('/createWithLogin', isAuth, createWithLogin)

module.exports = router
