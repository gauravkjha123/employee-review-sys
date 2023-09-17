import express from 'express';
import userRoutes from './user.route.js'
import habitRoutes from './review.route.js'
import companyRoutes from './company.route.js'
import apiRoutes from './api/index.js'
import { home } from '../controllers/home.controller.js';

const router=express.Router();

router.get('/',home);
router.use('/user',userRoutes)
router.use('/review',habitRoutes)
router.use('/company',companyRoutes)
router.use('/api',apiRoutes)

export default router;