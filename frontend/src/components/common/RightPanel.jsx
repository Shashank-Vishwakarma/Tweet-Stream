import { Link } from "react-router-dom";
import { useQuery } from '@tanstack/react-query'
import RightPanelSkeleton from "../skeletons/RightPanelSkeleton";
import toast from "react-hot-toast";
import useFollowOrUnfollow from "../../hooks/useFollowOrUnfollow";

const RightPanel = () => {
    const { isLoading, data: suggestedUsers } = useQuery({
        queryKey: ["suggested"],
        queryFn: async () => {
            try {
                const response = await fetch(`http://localhost:3000/api/v1/user/suggested`, {
                    credentials: "include",
                });
                const data = await response.json();

                if (!response.ok || data.error) {
                    throw new Error(data.error);
                }

                return data;
            } catch (err) {
                console.log(`Error in suggested users query: ${err.message}`);
                toast.error(err.message);
            }
        }
    });

    const { followOrUnfollowUserMutation, isPending, text } = useFollowOrUnfollow();

    return (
        <div className='hidden lg:block my-4 mx-2'>
            <div className='bg-[#16181C] p-4 rounded-md sticky top-2'>
                <p className='font-bold'>Who to follow</p>
                <div className='flex flex-col gap-4'>
                    {/* item */}
                    {isLoading && (
                        <>
                            <RightPanelSkeleton />
                            <RightPanelSkeleton />
                            <RightPanelSkeleton />
                            <RightPanelSkeleton />
                        </>
                    )}
                    {!isLoading &&
                        suggestedUsers?.map((user) => (
                            <Link
                                to={`/profile/${user.username}`}
                                className='flex items-center justify-between gap-4'
                                key={user._id}
                            >
                                <div className='flex gap-2 items-center'>
                                    <div className='avatar'>
                                        <div className='w-8 rounded-full'>
                                            <img src={user.profileImage || "/avatar-placeholder.png"} />
                                        </div>
                                    </div>
                                    <div className='flex flex-col'>
                                        <span className='font-semibold tracking-tight truncate w-28'>
                                            {user.fullName}
                                        </span>
                                        <span className='text-sm text-slate-500'>@{user.username}</span>
                                    </div>
                                </div>
                                <div>
                                    <button
                                        className={`btn bg-white text-black hover:bg-white hover:opacity-90 rounded-full btn-sm ${isPending ? 'loading loading-spinner' : ''}`}
                                        onClick={(e) => {
                                            e.preventDefault()
                                            followOrUnfollowUserMutation(user._id);
                                        }}
                                    >
                                        {text || "Follow"}
                                    </button>
                                </div>
                            </Link>
                        ))}
                </div>
            </div>
        </div>
    );
};
export default RightPanel;