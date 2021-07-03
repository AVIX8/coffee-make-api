const jwt = require('jsonwebtoken')

module.exports.isAuth = (req, res, next) => {
    if (req.method === "OPTIONS") {
        next()
    }

    try {
        const token = req.headers.authorization?.split(' ')?.[1]
        req.headers.authorization//?
        token //?
        if (!token) {
            return res.status(401).json({message: "Пользователь не авторизован"})
        }
        const decodedData = jwt.verify(token, process.env.JWT_SECRET_KEY)
        req.user = decodedData
        next()
    } catch (e) {
        // console.log(e)
        e //?
        return res.status(401).json({message: "Пользователь не авторизован"})
    }
}

module.exports.hasRole = (roles) => {
    return (req, res, next) => {
        if (req.method === "OPTIONS") {
            next()
        }

        try {
            const token = req.headers.authorization?.split(' ')?.[1]
            if (!token) {
                return res.status(401).json({message: "Пользователь не авторизован"})
            }

            const {roles: userRoles} = jwt.verify(token, process.env.JWT_SECRET_KEY)
            let hasRole = false
            userRoles.forEach(role => {
                if (roles.includes(role)) {
                    hasRole = true
                }
            })
            if (!hasRole) {
                return res.status(403).json({message: "У вас нет доступа"})
            }
            next();
        } catch (e) {
            // console.log(e)
            e //?
            return res.status(401).json({message: "Пользователь не авторизован"})
        }
    }
}