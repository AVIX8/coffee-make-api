const { Router } = require('express')

const { isAdmin } = require('../middlewares/auth')
const { upload } = require('../middlewares/upload')

const { get, create, update, del } = require('../controllers/category')

const router = Router()

router.post('/', get)

router.post('/create', isAdmin, upload.single('image'), create)
router.post('/update', isAdmin, update)
router.post('/delete', isAdmin, del)

// router.get('/profile', isAuth, getUserData)

module.exports = router
