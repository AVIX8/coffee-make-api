const { Router } = require('express')
const { hasRole } = require("../middlewares/auth")
const { get, getImageById } = require("../controllers/storage")

const router = Router()

router.get('/', hasRole(['admin']), get)
router.get('/image/:id', getImageById)

module.exports = router
