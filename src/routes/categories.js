const { Router } = require('express')

const { hasRole } = require('../middlewares/auth')
const { upload } = require('../middlewares/upload')

const category = require('../controllers/category')

const router = Router()

router.post('/get', category.get)
router.post('/getFilters', category.getFilters)
router.post('/getProducts', category.getProducts)

router.post('/getInfo', hasRole(['admin']), category.getInfo)
router.post('/create', hasRole(['admin']), upload.single('image'), category.create)
router.post('/update', hasRole(['admin']), upload.single('image'), category.update)

router.post('/delete', hasRole(['admin']), category.del)

module.exports = router
