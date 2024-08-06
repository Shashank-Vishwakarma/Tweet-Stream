import Notification from "../models/notificationModel.js";
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
    try {
        const allPosts = await Post.find().sort({ createdAt: -1 }).populate({
            path: "user",
            select: "-password"
        }).populate({
            path: "comments.user",
            select: "-password"
        });

        res.status(200).json(allPosts);
    } catch (error) {
        console.log(`Error in getPostsOfFollowedUsers: ${error.message}`);
        res.status(500).json({ error: "Internal server error" });
    }
}

export const deletePost = async (req, res) => {
    try {
        const { id } = req.params; // post id
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
    try {
        const { id } = req.params; // post id
        const post = await Post.findById(id);
        if (!post) {
            return res.status(400).json({ error: "Post not found" });
        }

        const isPostAlreadyLiked = post.likes.includes(req.user._id);

        if (isPostAlreadyLiked) { // unlike the post
            post.likes = post.likes.filter(like => String(like) !== String(req.user._id));

            await User.findByIdAndUpdate(req.user._id, {
                $pull: {
                    likedPosts: id
                }
            });
        } else { // like the post
            post.likes.push(req.user._id);

            await User.findByIdAndUpdate(req.user._id, {
                $push: {
                    likedPosts: id
                }
            });

            // send a notification
            const notification = new Notification({
                from: req.user._id,
                to: post.user,
                type: "like"
            });

            await notification.save();
        }

        await post.save();

        res.status(200).json({ message: isPostAlreadyLiked ? "Unliked the post" : "Liked the post" });
    } catch (error) {
        console.log(`Error in likeOrUnlikePost: ${error.message}`);
        res.status(500).json({ error: "Internal server error" });
    }
}

export const commentOnPost = async (req, res) => {
    try {
        const { id } = req.params; // post id
        const post = await Post.findById(id);
        if (!post) {
            return res.status(400).json({ error: "Post not found" });
        }

        const { text } = req.body;
        if (!text) {
            return res.status(400).json({ error: "Please write something to comment" });
        }

        post.comments.push({ text, user: req.user._id });
        await post.save();

        res.status(201).json({ message: "Comment created on post" });
    } catch (error) {
        console.log(`Error in commentOnPost: ${error.message}`);
        res.status(500).json({ error: "Internal server error" });
    }
}

export const getAllCommentsOnAPost = async (req, res) => {
    try {
        const { id } = req.params; // post id
        const post = await Post.findById(id);
        if (!post) {
            return res.status(400).json({ error: "Post not found" });
        }

        const allCommentsOnThisPost = await Post.findById(id).select("comments").populate({
            path: "comments.user",
            select: "-password"
        });
        res.status(200).json(allCommentsOnThisPost?.comments);
    } catch (error) {
        console.log(`Error in getAllComments: ${error}`);
        res.status(500).json({ error: "Internal server error" });
    }
}

export const getAllLikedPostsByAnUser = async (req, res) => {
    try {
        const { id } = req.params; // user id
        const user = await User.findById(id);
        if (!user) {
            return res.status(400).json({ error: "User not found" });
        }

        const allLikedPosts = await Post.find({ _id: { $in: user.likedPosts } })
            .populate({
                path: "user",
                select: "-password"
            })
            .populate({
                path: "comments.user",
                select: "-password"
            });
        res.status(200).json(allLikedPosts);
    } catch (error) {
        console.log(`Error in getAllLikedPostsByAnUser: ${error}`);
        res.status(500).json({ error: "Internal server error" });
    }
}

export const getAllPostsOfFollowedUsers = async (req, res) => {
    try {
        const id = req.user._id;
        const user = await User.findById(id);
        if (!user) {
            return res.status(400).json({ error: "user not found" });
        }

        const followedUsers = user.following;
        const postsOfFollowedUsers = await Post.find({ user: { $in: followedUsers } })
            .sort({ createdAt: -1 })
            .populate({
                path: "user",
                select: "-password"
            })
            .populate({
                path: "comments.user",
                select: "-password"
            });

        res.status(200).json(postsOfFollowedUsers);
    } catch (error) {
        console.log(`Error in  getAllPostsOfFollowedUsers: ${error.message}`);
        res.status(500).json({ error: "Internal server error" });
    }
}

export const getUserPosts = async (req, res) => {
    try {
        const { username } = req.params;
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(200).json({ error: "User not found" });
        }

        const posts = await Post.find({ user: user._id })
            .sort({ createdAt: -1 })
            .populate({
                path: "user",
                select: "-password"
            })
            .populate({
                path: "comments.user",
                select: "-password"
            });
        res.status(200).json(posts);
    } catch (error) {
        console.log(`Error in  getMyPosts: ${error.message}`);
        res.status(500).json({ error: "Internal server error" });
    }
}