import { Router } from 'express'
import User from '../models/User.js'
// const authCheck = require("../middlewares/authCheck")
const router = Router()

router.post('/', async (req, res) => {
    // const user = await User.findOne({ _id: req.user._id })
    res.send({ somedata: 'lolar' })
})

export default router
