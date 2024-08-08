import { MdHomeFilled } from "react-icons/md";
import { IoNotifications } from "react-icons/io5";
import { FaUser } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { BiLogOut } from "react-icons/bi";
import { useMutation, useQuery } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { useAuthContext } from "../../context/authContext";

const Sidebar = () => {
    const navigateTo = useNavigate();
    const { user: data, setUser } = useAuthContext();

    const { mutate: logoutMutation, isError } = useMutation({
        mutationFn: async () => {
            try {
                const response = await fetch("http://localhost:3000/api/v1/auth/logout", {
                    method: "POST",
                    credentials: "include"
                });


                if (!response.ok) {
                    toast.error(response.statusText)
                    throw new Error("Something went wrong in logout mutaion");
                }

                const data = await response.json();

                toast.success(data?.message);
                setUser(null);
                navigateTo('/login');

                return data;
            } catch (err) {
                console.log(`Error in logout : ${err.message}`);
            }
        }
    })

    const handleLogout = () => {
        logoutMutation();
    }

    return (
        <div className='md:flex-[2_2_0] w-18 max-w-52'>
            <div className='sticky top-0 left-0 h-screen flex flex-col border-r border-gray-700 w-20 md:w-full'>
                <ul className='flex flex-col gap-3 mt-4'>
                    <li className='flex justify-center md:justify-start'>
                        <Link
                            to='/'
                            className='flex gap-3 items-center hover:bg-stone-900 transition-all rounded-full duration-300 py-2 pl-2 pr-4 max-w-fit cursor-pointer'
                        >
                            <MdHomeFilled className='w-8 h-8' />
                            <span className='text-lg hidden md:block'>Home</span>
                        </Link>
                    </li>
                    <li className='flex justify-center md:justify-start'>
                        <Link
                            to='/notifications'
                            className='flex gap-3 items-center hover:bg-stone-900 transition-all rounded-full duration-300 py-2 pl-2 pr-4 max-w-fit cursor-pointer'
                        >
                            <IoNotifications className='w-6 h-6' />
                            <span className='text-lg hidden md:block'>Notifications</span>
                        </Link>
                    </li>

                    <li className='flex justify-center md:justify-start'>
                        <Link
                            to={`/profile/${data?.username}`}
                            className='flex gap-3 items-center hover:bg-stone-900 transition-all rounded-full duration-300 py-2 pl-2 pr-4 max-w-fit cursor-pointer'
                        >
                            <FaUser className='w-6 h-6' />
                            <span className='text-lg hidden md:block'>Profile</span>
                        </Link>
                    </li>
                </ul>
                {data && (
                    <Link
                        to={`/profile/${data.username}`}
                        className='mt-auto mb-10 flex gap-2 items-start transition-all duration-300 hover:bg-[#181818] py-2 px-4 rounded-full'
                    >
                        <div className='avatar hidden md:inline-flex'>
                            <div className='w-8 rounded-full'>
                                <img src={data?.profileImg || "/avatar-placeholder.png"} />
                            </div>
                        </div>
                        <div className='flex justify-between flex-1'>
                            <div className='hidden md:block'>
                                <p className='text-white font-bold text-sm w-20 truncate'>{data?.fullName}</p>
                                <p className='text-slate-500 text-sm'>@{data?.username}</p>
                            </div>
                            <BiLogOut
                                className='w-5 h-5 cursor-pointer'
                                onClick={handleLogout} />
                            {isError && <p>Something went Wrong</p>}
                        </div>
                    </Link>
                )}
            </div>
        </div>
    );
};
export default Sidebar;