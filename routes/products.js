const router = require('express').Router()
const User = require('../models/User')
// const jwt = require("jsonwebtoken")
const authCheck = require("../middlewares/authCheck")

router.post('/', authCheck, async (req,res) => {
    const user = await User.findOne({_id: req.user._id})
    res.send({'somedata': 'lolar', user})
})

module.exports = router