import express from 'express';
import cookieParser from 'cookie-parser';
import cloudinary from 'cloudinary';
import cors from 'cors';
import path from 'path';

import { ENV_VARIABLES } from './config/envVariables.js';

import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import postRoutes from './routes/postRoutes.js';
import notificationRoutes from './routes/notificationRoutes.js';

import db from './database/db.js';

cloudinary.v2.config({
    cloud_name: ENV_VARIABLES.CLOUDINARY_CLOUD_NAME,
    api_key: ENV_VARIABLES.CLOUDINARY_API_KEY,
    api_secret: ENV_VARIABLES.CLOUDINARY_API_SECRET,
    secure: true
});

const app = express();

app.use(cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true
}));

// limit is set to prevent Denial of Service (DOS attack) to prevent server crash with large file
app.use(express.json({ limit: "5mb" })); // parse json data --> req.body
app.use(express.urlencoded({ extended: true })); // parse form data (urlencoded) as object --> req.body
app.use(cookieParser()); // parse req.cookies as object

// routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/user', userRoutes);
app.use('/api/v1/post', postRoutes);
app.use('/api/v1/notifications', notificationRoutes);


// <------- Set up for Deployment ------->
const __dirname = path.resolve();

// whatever the routes are coming other than those defined above, redirect to frontend
if (ENV_VARIABLES.NODE_ENV === "production") {
    // serve the static assets
    app.use(express.static(path.join(__dirname, "/frontend/dist")));

    // server the index.html file
    app.get("*", (req, res) => {
        res.sendFile(path.resolve(__dirname, "frontend", "dist", "index.html"));
    })
}

const PORT = ENV_VARIABLES.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});