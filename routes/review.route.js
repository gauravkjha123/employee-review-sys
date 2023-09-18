import express from 'express';
import { getAllReviews,assignReview,dashBoard,createReview, updateReview} from '../controllers/review.controller.js';
import { auth } from '../middlwere/auth.js';
import { authorize } from '../middlwere/authrize.js';


const router=express.Router();

router.get('/',auth,dashBoard);
router.get('/all-reviews',auth,authorize,getAllReviews);
router.get('/assign',auth,authorize,assignReview);
router.post('/create',auth,authorize,createReview);
router.post('/:id/update',auth,updateReview);


export default router;