const { Router } = require('express')
const { get, create, update } = require('../controllers/category')
const { isAdmin } = require('../middlewares/auth')

const router = Router()
router.post('/', get)
router.post('/create', isAdmin, create)
router.post('/update', isAdmin, update)
// router.get('/profile', isAuth, getUserData)

module.exports = router
