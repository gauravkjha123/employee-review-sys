import express from 'express';
import { login,createSession,signUp,create,logOut,getAllUsers,getUserById,updateUser } from '../controllers/user.controller.js';
import { auth } from '../middlwere/auth.js';

const router=express.Router();

router.get('/',auth,getAllUsers);
router.get('/:id/profile',auth,getUserById);
router.post('/:id/update',auth,updateUser);
router.get('/sign-up',signUp);
router.post('/sign-up',create);
router.get('/sign-in',login);
router.post('/sign-in',createSession);
router.get('/sign-out',logOut);


export default router;