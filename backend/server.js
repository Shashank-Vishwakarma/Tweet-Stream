import express from 'express';
import cookieParser from 'cookie-parser';
import cloudinary from 'cloudinary';

import { ENV_VARIABLES } from './config/envVariables.js';

import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import postRoutes from './routes/postRoutes.js';

import db from './database/db.js';

cloudinary.v2.config({
    cloud_name: ENV_VARIABLES.CLOUDINARY_CLOUD_NAME,
    api_key: ENV_VARIABLES.CLOUDINARY_API_KEY,
    api_secret: ENV_VARIABLES.CLOUDINARY_API_SECRET,
    secure: true
});

const app = express();

app.use(express.json()); // parse json data --> req.body
app.use(express.urlencoded({ extended: true })); // parse form data (urlencoded) as object --> req.body
app.use(cookieParser()); // parse req.cookies as object

// routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/user', userRoutes);
app.use('/api/v1/post', postRoutes);

const PORT = ENV_VARIABLES.PORT;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});