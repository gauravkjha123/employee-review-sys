import express from 'express';
import { createCompany,renderCreateCompany } from '../controllers/company.controller.js';
// import { checkSession } from '../middlwere/auth.js';


const router=express.Router();

router.get('/create-company',renderCreateCompany);
router.post('/create-company',createCompany);



export default router;