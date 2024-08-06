import express from 'express';
import { createPost, getAllPosts, deletePost, likeOrUnlikePost, commentOnPost, getAllCommentsOnAPost, getAllLikedPostsByAnUser, getAllPostsOfFollowedUsers, getUserPosts } from '../controllers/postController.js';
import { protectRoutewithJwt } from '../middlewares/protectRouteWithJwt.js';

const postRoutes = express.Router();

postRoutes.post('/create', protectRoutewithJwt, createPost);
postRoutes.get('/all', protectRoutewithJwt, getAllPosts);
postRoutes.delete('/:id', protectRoutewithJwt, deletePost);
postRoutes.post('/like/:id', protectRoutewithJwt, likeOrUnlikePost);
postRoutes.post('/comment/:id', protectRoutewithJwt, commentOnPost);
postRoutes.get('/comments/:id', protectRoutewithJwt, getAllCommentsOnAPost);
postRoutes.get('/likes/:id', protectRoutewithJwt, getAllLikedPostsByAnUser);
postRoutes.get('/following', protectRoutewithJwt, getAllPostsOfFollowedUsers);
postRoutes.get('/user/:username', protectRoutewithJwt, getUserPosts);

export default postRoutes;