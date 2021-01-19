import { Router } from 'express'
import { get, create, update } from '../controllers/category.js'
import { isAdmin } from "../middlewares/auth.js";

const router = Router()
router.post('/', get);
router.post('/create', isAdmin, create)
router.post('/update', isAdmin, update)
// router.get('/profile', isAuth, getUserData)

export default router
