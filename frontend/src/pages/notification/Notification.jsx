import { Link } from "react-router-dom";
import LoadingSpinner from "../../components/common/LoadingSpinner";

import { IoSettingsOutline } from "react-icons/io5";
import { FaUser } from "react-icons/fa";
import { FaHeart } from "react-icons/fa6";

import { useMutation, useQuery } from '@tanstack/react-query';

import { toast } from 'react-hot-toast'

const Notification = () => {
    const { isLoading, data: notifications } = useQuery({
        queryKey: ["notifications"],
        queryFn: async () => {
            try {
                const response = await fetch("http://localhost:3000/api/v1/notifications", { credentials: "include" });
                const data = await response.json();

                if (!response.ok) {
                    throw new Error(data.error || "Something went wrong in getting the notifications");
                }

                return data;
            } catch (err) {
                toast.error(err.message);
                console.log(`Error in notifications query: ${err.message}`);
            }
        }
    });

    const { mutate: deleteAllNotifications } = useMutation({
        mutationFn: async () => {
            try {
                const response = await fetch("http://localhost:3000/api/v1/notifications", {
                    method: "DELETE",
                    credentials: "include"
                });
                const data = await response.json();

                if (!response.ok) {
                    throw new Error(data.error || "Something went wrong in deleting the notifications");
                }

                toast.success(data?.message);

                return data;
            } catch (err) {
                toast.error(err.message);
                console.log(`Error in notifications query: ${err.message}`);
            }
        }
    })

    const deleteNotifications = () => {
        deleteAllNotifications();
    };

    return (
        <>
            <div className='flex-[4_4_0] border-l border-r border-gray-700 min-h-screen'>
                <div className='flex justify-between items-center p-4 border-b border-gray-700'>
                    <p className='font-bold'>Notifications</p>
                    <div className={`dropdown ${notifications?.length === 0 ? "hidden" : ""}`}>
                        <div tabIndex={0} role='button' className='m-1'>
                            <IoSettingsOutline className='w-4' />
                        </div>
                        <ul
                            tabIndex={0}
                            className='dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52'
                        >
                            <li>
                                <a onClick={deleteNotifications}>Delete all notifications</a>
                            </li>
                        </ul>
                    </div>
                </div>
                {isLoading && (
                    <div className='flex justify-center h-full items-center'>
                        <LoadingSpinner size='lg' />
                    </div>
                )}
                {notifications?.length === 0 && <div className='text-center p-4 font-bold'>No notifications 🤔</div>}
                {notifications?.map((notification) => (
                    <div className='border-b border-gray-700' key={notification?._id}>
                        <div className='flex flex-row gap-2 p-4'>
                            {notification?.type === "follow" && <FaUser className='w-7 h-7 text-primary' />}
                            {notification?.type === "like" && <FaHeart className='w-7 h-7 text-red-500' />}
                            <Link to={`/profile/${notification?.from.username}`} className="flex gap-2">
                                <div className='avatar'>
                                    <div className='w-8 rounded-full'>
                                        <img src={notification?.from.profileImage || "/avatar-placeholder.png"} />
                                    </div>
                                </div>
                                <div className='flex gap-1'>
                                    <span className='font-bold'>@{notification?.from.username}</span>{" "}
                                    {notification?.type === "follow" ? "followed you" : "liked your post"}
                                </div>
                            </Link>
                        </div>
                    </div>
                ))}
            </div>
        </>
    );
};
export default Notification;