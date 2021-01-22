const { Router } = require('express')
const {
    register,
    login,
    logout,
    getUserData,
    profile
} = require('../controllers/user.js')
const { isAuth } = require('../middlewares/auth.js')

const router = Router()
router.post('/register', register)
router.post('/login', login)
router.get('/logout', logout)
router.get('/profile', isAuth, profile) // изменить
router.get('/getUserData', isAuth, getUserData)

module.exports = router
