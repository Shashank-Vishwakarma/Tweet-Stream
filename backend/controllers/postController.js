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
            return res.status(400).json({ error: "Post should have a text or an image" });
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
    try {
        const { id } = req.params;
        const post = await Post.findById(id);
        if (!post) {
            return res.status(400).json({ error: "Post not found" });
        }

        if (String(post.user) !== String(req.user._id)) {
            return res.status(400).json({ error: "You are not authorized to delete this post" });
        }

        if (post.image) {
            await cloudinary.v2.uploader.destroy(post.image.split("/").pop().split(".")[0]);
        }

        await Post.findByIdAndDelete(id);

        res.status(200).json({ message: "Post deleted successfully" });
    } catch (error) {
        console.log(`Error in deletePost: ${error.message}`);
        res.status(500).json({ error: "Internal server error" });
    }
}

export const likeOrUnlikePost = async (req, res) => {

}

export const commentOnPost = async (req, res) => {

}

export const getAllComments = async (req, res) => {

}
