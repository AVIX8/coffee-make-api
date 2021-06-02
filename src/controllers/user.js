module.exports.getUserData = (req, res) => {
    return res.send({ user: req.user })
}

// доделать
module.exports.profile = (req, res) => {
    return res.send({ profile: { user: req.user, orders: {} } })
}
