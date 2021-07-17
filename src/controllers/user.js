// const User = require('../models/User.js')

// доделать
module.exports.profile = (req, res) => {
    return res.send({ profile: { user: req.user, orders: {} } })
}
