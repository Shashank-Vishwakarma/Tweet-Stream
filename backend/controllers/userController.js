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

export const followOrUnfollowUser = () => {

}

export const getSuggestedUsers = () => {

}