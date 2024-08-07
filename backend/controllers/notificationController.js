import Notification from "../models/notificationModel.js";
import User from "../models/userModel.js";

export const getNotifications = async (req, res) => {
    try {
        const userId = req.user._id;
        const user = await User.findById(userId);
        if (!user) {
            return res.status(400).json({ error: "User not found" });
        }

        const notifications = await Notification.find({ to: userId }).populate({
            path: "from",
            select: "username profileImage"
        });

        // make all the notifications read
        await Notification.updateMany({ to: userId }, { read: true });

        res.status(200).json(notifications);
    } catch (error) {
        console.log(`Error in getNotifications: ${error.message}`);
        res.status(500).json({ error: "Internal server error" });
    }
}

export const deleteNotifications = async (req, res) => {
    try {
        const userId = req.user._id;
        const user = await User.findById(userId);
        if (!user) {
            return res.status(400).json({ error: "User not found" });
        }

        await Notification.deleteMany({ to: userId });

        res.status(200).json({ message: "Notifications deleted successfully" });
    } catch (error) {
        console.log(`Error in getNotifications: ${error.message}`);
        res.status(500).json({ error: "Internal server error" });
    }
}
