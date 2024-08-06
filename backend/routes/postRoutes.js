import express from 'express';
import { createPost, getAllPosts } from '../controllers/postController.js';

const postRoutes = express.Router();

postRoutes.post('/', createPost);
postRoutes.get('/all', getAllPosts);

export default postRoutes;