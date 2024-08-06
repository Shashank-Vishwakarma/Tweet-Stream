import Notification from "../models/notificationModel.js";
import User from "../models/userModel.js";
import cloudinary from 'cloudinary';
import bcrypt from 'bcrypt';

export const getUserProfile = async (req, res) => {
    const { username } = req.params;

    try {
        const user = await User.findOne({ username }).select(["-password", "-email"]);
        if (!user) {
            return res.status(400).json({ error: "Couldn't find the User" });
        }

        res.status(200).json(user);
    } catch (error) {
        console.log(`Error in getUserProfile: ${error}`);
        res.status(500).json({ error: "Internal server error" });
    }
}

export const updateUserProfile = async (req, res) => {
    try {
        const id = req.user._id;
        const user = await User.findById(id);
        if (!user) {
            res.status(400).json({ error: "User not found" });
        }

        const { fullName, username, email, currentPassword, newPassword, bio, link } = req.body;
        let { profileImage, coverImage } = req.body;

        let isChangePassword = false;

        // in case, user wants to change the password
        if ((!currentPassword && newPassword) || (currentPassword && !newPassword)) {
            return res.status(400).json({ error: "Please enter both current and new password if you want to change your password" });
        }

        if (currentPassword && newPassword) {
            isChangePassword = true;

            if (currentPassword.length < 6 || newPassword.length < 6) {
                return res.status(400).json({ error: "Passwords must be of 6 characters" });
            }

            const isPasswordSame = await user.comparePassword(currentPassword);
            if (!isPasswordSame) {
                return res.status(400).json({ error: "Incorrect password entered" });
            }
        }

        if (profileImage) {
            if (user.profileImage) {
                await cloudinary.v2.uploader.destroy(user.profileImage.split("/").pop().split(".")[0]);
            }
            const response = await cloudinary.v2.uploader.upload(profileImage);
            profileImage = response.secure_url;
        }

        if (coverImage) {
            if (user.coverImage) {
                await cloudinary.v2.uploader.destroy(user.coverImage.split("/").pop().split(".")[0]);
            }
            const response = await cloudinary.v2.uploader.upload(coverImage);
            coverImage = response.secure_url;
        }

        const salt = await bcrypt.genSalt(10);

        await user.updateOne({
            fullName: fullName || user.fullName,
            email: email || user.email,
            username: username || user.username,
            password: isChangePassword ? await bcrypt.hash(newPassword, salt) : user.password,
            bio: bio || user.bio,
            link: link || user.link,
            profileImage: profileImage || user.profileImage,
            coverImage: coverImage || user.coverImage
        }, {
            new: true,
            runValidators: true
        });

        res.status(200).json({ user: "Profile updated successfully" });
    } catch (error) {
        console.log(`Error in updateUserProfile: ${error}`);
        res.status(500).json({ error: "Internal server error" });
    }
}

export const followOrUnfollowUser = async (req, res) => {
    try {
        const currentUserId = req.user._id;
        const { id: otherUserId } = req.params;
        const user = await User.findById(otherUserId);
        if (!user) {
            return res.status(400).json({ error: "This user does not exists" })
        }

        if (String(currentUserId) === otherUserId) {
            return res.status(400).json({ error: "You cannot follow/unfollow yourself" });
        }

        const currentUser = await User.findById(currentUserId);
        const isFollowing = currentUser?.following?.includes(otherUserId);

        if (isFollowing) { // unfollow the user
            // update my following
            await User.findByIdAndUpdate(currentUserId, { $pull: { following: otherUserId } });
            // update the followers of other user
            await User.findByIdAndUpdate(otherUserId, { $pull: { followers: currentUserId } });
        } else { // follow the user
            // update my following
            await User.findByIdAndUpdate(currentUserId, { $push: { following: otherUserId } });
            // update the followers of other user
            await User.findByIdAndUpdate(otherUserId, { $push: { followers: currentUserId } });

            // send follow notification
            const notification = new Notification({
                from: currentUserId,
                to: otherUserId,
                type: "follow"
            });

            await notification.save();
        }

        res.status(200).json({ mesage: isFollowing ? "Unfollow successful" : "Follow successful" });
    } catch (error) {
        console.log(`Error in followOrUnfollowUser: ${error}`);
        res.status(500).json({ error: "Internal server error" });
    }
}

export const getSuggestedUsers = async (req, res) => {
    try {
        const id = req.user._id;
        const users = await User.aggregate([
            {
                $match: {
                    _id: { $ne: id }
                }
            },
            {
                $sample: { size: 10 }
            }
        ]);

        const followedUsers = await User.findById(id).select("following");
        const filteredUsers = users.filter(user => !followedUsers.following.includes(user._id));

        const suggestedUsers = filteredUsers.slice(0, 4);
        suggestedUsers.forEach(user => user.password = null);

        res.status(200).json(suggestedUsers);
    } catch (error) {
        console.log(`Error in getSuggestedUsers: ${error}`);
        res.status(500).json({ error: "Internal server error" });
    }
}