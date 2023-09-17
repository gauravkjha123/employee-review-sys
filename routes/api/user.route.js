import express from 'express';
import { updateUser,deleteUser } from '../../controllers/api/user.controller.js';
import { auth } from '../../middlwere/api/auth.js';

const router=express.Router();

router.put('/:id',auth,updateUser);
router.delete('/:id',auth,deleteUser);

export default router;