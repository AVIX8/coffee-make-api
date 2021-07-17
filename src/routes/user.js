const { Router } = require('express')
const { profile } = require('../controllers/user.js')
const { isAuth } = require('../middlewares/auth.js')

const router = Router()
router.get('/profile', isAuth, profile)

module.exports = router
