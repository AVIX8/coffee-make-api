const { Router } = require( 'express')
const { hasRole } = require('../middlewares/auth')
const { get, getBySlug, getByCategory, create, del } = require('../controllers/product')

const router = Router()

router.post('/', async (req, res) => {
    // const user = await User.findOne({ _id: req.user._id })
    res.send({ somedata: 'lolar' })
})

router.post('/get', get)
router.post('/getBySlug', getBySlug)
router.post('/getByCategory', getByCategory)

router.post('/create', hasRole(['admin']), create)
router.post('/delete', hasRole(['admin']), del)

module.exports = router
