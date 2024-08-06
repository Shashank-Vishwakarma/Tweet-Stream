import express from 'express';
import { createPost, getAllPosts, deletePost, likeOrUnlikePost, commentOnPost, getAllComments } from '../controllers/postController.js';
import { protectRoutewithJwt } from '../middlewares/protectRouteWithJwt.js';

const postRoutes = express.Router();

postRoutes.post('/create', protectRoutewithJwt, createPost);
postRoutes.get('/all', protectRoutewithJwt, getAllPosts);
postRoutes.delete('/:id', protectRoutewithJwt, deletePost);
postRoutes.post('/like/:id', protectRoutewithJwt, likeOrUnlikePost);
postRoutes.delete('/comment/:id', protectRoutewithJwt, commentOnPost);
postRoutes.get('/comments', protectRoutewithJwt, getAllComments);

export default postRoutes;