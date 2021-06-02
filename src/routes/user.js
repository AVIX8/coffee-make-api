const { Router } = require('express')
const {
    getUserData,
    profile
} = require('../controllers/user.js')
const { isAuth } = require('../middlewares/auth.js')

const router = Router()
router.get('/profile', isAuth, profile)
router.get('/getUserData', isAuth, getUserData)

module.exports = router
