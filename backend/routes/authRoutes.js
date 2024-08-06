import express from 'express';
import { signUpAuth, loginAuth, logoutAuth } from '../controllers/authController.js'
import { protectRoutewithJwt } from '../middlewares/protectRouteWithJwt.js';

const authRoutes = express.Router();

authRoutes.post('/signup', signUpAuth);
authRoutes.post('/login', loginAuth);
authRoutes.get('/logout', protectRoutewithJwt, logoutAuth);

export default authRoutes;