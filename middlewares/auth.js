  
export function isAuth(req, res, next) {
    if (req.isAuthenticated()) {
        next();
    } else {
        res.status(401).json({ message: 'Вы не авторизованы' });
    }
}

export function isAdmin(req, res, next) {
    if (req.isAuthenticated() && req.user.admin) {
        next();
    } else {
        res.status(401).json({ message: 'Вы не администратор' });
    }
}