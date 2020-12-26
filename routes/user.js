import { Router } from 'express'
import { register, login, logout, getUserData } from '../controllers/user.js'
import { isAuth } from "../middlewares/auth.js";

const router = Router()
router.post('/register', register)
router.post('/login', login)
router.get('/logout', logout);
router.get('/profile', isAuth, getUserData)

export default router
