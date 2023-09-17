import express from 'express';
import { getAllReviews,assignReview,dashBoard } from '../controllers/review.controller.js';
import { auth } from '../middlwere/auth.js';
import { authorize } from '../middlwere/authrize.js';


const router=express.Router();

router.get('/',auth,dashBoard);
router.get('/all-reviews',auth,authorize,getAllReviews);
router.get('/assign',auth,authorize,assignReview);


export default router;