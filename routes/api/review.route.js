import express from 'express';
import { deleteReview } from '../../controllers/api/review.controller.js';
import { auth } from '../../middlwere/api/auth.js';
import { authorize } from '../../middlwere/api/authrize.js';


const router=express.Router();

router.delete('/:id',auth,authorize,deleteReview);

export default router;