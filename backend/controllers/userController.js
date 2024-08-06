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

            res.status(200).json({ mesage: "Unfollow successful" });
        } else { // follow the user
            // update my following
            await User.findByIdAndUpdate(currentUserId, { $push: { following: otherUserId } });
            // update the followers of other user
            await User.findByIdAndUpdate(otherUserId, { $push: { followers: currentUserId } });

            res.status(200).json({ mesage: "Follow successful" });
        }
    } catch (error) {
        console.log(`Error in followOrUnfollowUser: ${error}`);
        res.status(500).json({ error: "Internal server error" });
    }
}

export const getSuggestedUsers = () => {

}