import express from 'express';
import { deleteUser,updateUserRole } from '../../controllers/api/user.controller.js';
import { auth } from '../../middlwere/api/auth.js';

const router=express.Router();

router.put('/:id',auth,updateUserRole);
router.delete('/:id',auth,deleteUser);

export default router;