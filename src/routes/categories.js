const { Router } = require('express')

const { hasRole } = require('../middlewares/auth')
const { upload } = require('../middlewares/upload')

const { get, getProducts, create, update, del } = require('../controllers/category')

const router = Router()

router.post('/', get)
router.post('/getProducts', getProducts)

router.post('/create', hasRole(['admin']), upload.single('image'), create)
router.post('/update', hasRole(['admin']), update)
router.post('/delete', hasRole(['admin']), del)

module.exports = router
