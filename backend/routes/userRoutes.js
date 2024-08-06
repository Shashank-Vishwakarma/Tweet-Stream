import express from 'express';
import { protectRoutewithJwt } from '../middlewares/protectRouteWithJwt.js';
import { getUserProfile, updateUserProfile, followOrUnfollowUser, getSuggestedUsers } from '../controllers/userController.js';

const userRoutes = express.Router();

userRoutes.get('/profile/:username', protectRoutewithJwt, getUserProfile);
userRoutes.put('/update', protectRoutewithJwt, updateUserProfile);
userRoutes.post('/follow/:id', protectRoutewithJwt, followOrUnfollowUser);
userRoutes.get('/suggested', protectRoutewithJwt, getSuggestedUsers);

export default userRoutes;