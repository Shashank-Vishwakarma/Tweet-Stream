import Post from "../models/postModel.js";
import User from "../models/userModel.js";
import cloudinary from 'cloudinary';

export const createPost = async (req, res) => {
    try {
        const userId = req.user._id;
        const user = await User.findById(userId);
        if (!user) {
            return res.status(400).json({ error: "User not found" });
        }

        let post = { user: userId };

        const { text, image } = req.body;
        if (!text && !image) {
            res.status(400).json({ error: "Post should have a text or an image" });
        }

        if (text) {
            post.text = text;
        }

        if (image) {
            const postImage = await cloudinary.v2.uploader.upload(image);
            post.image = postImage.secure_url;
        }

        const newPost = new Post(post);
        await newPost.save();

        res.status(201).json({ post: newPost });
    } catch (error) {
        console.log(`Error in createPost: ${error.message}`);
        res.status(500).json({ error: "Internal server error" });
    }
}

export const getAllPosts = async (req, res) => {

}

export const deletePost = async (req, res) => {

}

export const likeOrUnlikePost = async (req, res) => {

}

export const commentOnPost = async (req, res) => {

}

export const getAllComments = async (req, res) => {

}
