import Notification from "../models/notificationModel.js";
import User from "../models/userModel.js";

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

export const updateUserProfile = () => {

}

export const followOrUnfollowUser = async (req, res) => {
    try {
        const currentUserId = req.user._id;
        const { id: otherUserId } = req.params;

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

        res.status(200).json({ suggestedUsers });
    } catch (error) {
        console.log(`Error in getSuggestedUsers: ${error}`);
        res.status(500).json({ error: "Internal server error" });
    }
}