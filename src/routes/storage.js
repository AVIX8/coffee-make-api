const { Router } = require('express')
const { isAdmin } = require("../middlewares/auth")
const { get, getImageById } = require("../controllers/storage")

const router = Router()

router.get('/', isAdmin, get)
router.get('/image/:id', getImageById)

module.exports = router
