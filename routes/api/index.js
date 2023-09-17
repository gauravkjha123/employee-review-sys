import express from 'express';
import userApiRoutes from './user.route.js'
import reviewApiRoutes from './review.route.js'

const router=express.Router();

router.use('/user',userApiRoutes)
router.use('/review',reviewApiRoutes)

export default router;