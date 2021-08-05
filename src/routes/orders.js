const { Router } = require( 'express')
const { isAuth, hasRole } = require('../middlewares/auth')

const { get, getValid, create, createWithLogin } = require('../controllers/order')

const router = Router()


router.post('/get', hasRole(['admin']), get)
router.post('/getValid', getValid)

router.post('/create', create)
router.post('/createWithLogin', isAuth, createWithLogin)

module.exports = router
