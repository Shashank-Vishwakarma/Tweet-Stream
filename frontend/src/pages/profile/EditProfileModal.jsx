import { useMutation, useQuery } from "@tanstack/react-query";
import { useRef, useState } from "react";
import toast from "react-hot-toast";

const EditProfileModal = () => {
    const { data: currentUser } = useQuery({
        queryKey: ["current", "user"],
        queryFn: async () => {
            try {
                const response = await fetch("http://localhost:3000/api/v1/auth/me", {
                    credentials: "include"
                });
                const data = await response.json();

                if (!response.ok || data.error) {
                    throw new Error(data.error);
                }

                return data;
            } catch (err) {
                console.log(`Error in get current user query: ${err}`);
                toast.error(err.message);
            }
        }
    })

    const [formData, setFormData] = useState({
        fullName: currentUser?.fullName,
        username: currentUser?.username,
        email: currentUser?.email,
        bio: currentUser?.bio,
        link: currentUser?.link,
        newPassword: "",
        currentPassword: "",
    });

    const modelRef = useRef();

    const { mutate: updateProfileMutation } = useMutation({
        mutationFn: async () => {
            try {
                const response = await fetch("http://localhost:3000/api/v1/user/update", {
                    method: "PUT",
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    credentials: "include",
                    body: JSON.stringify(formData)
                });
                const data = await response.json();

                if (!response.ok || data.error) {
                    throw new Error(data.error);
                }

                toast.success("Profile updated successfully");

                return data;
            } catch (err) {
                console.log(`Error in update profile mutation: ${err}`);
                toast.error(err.message);
            }
        }
    })

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleProfileUpdate = (e) => {
        e.preventDefault();
        updateProfileMutation();
    }

    return (
        <>
            <button
                className='btn btn-outline rounded-full btn-sm'
                onClick={() => modelRef.current.showModal()}
            >
                Edit profile
            </button>
            <dialog className='modal' ref={modelRef}>
                <div className='modal-box border rounded-md border-gray-700 shadow-md'>
                    <h3 className='font-bold text-lg my-3'>Update Profile</h3>
                    <form
                        className='flex flex-col gap-4'
                        onSubmit={handleProfileUpdate}
                    >
                        <div className='flex flex-wrap gap-2'>
                            <input
                                type='text'
                                placeholder='Full Name'
                                className='flex-1 input border border-gray-700 rounded p-2 input-md'
                                value={formData.fullName}
                                name='fullName'
                                onChange={handleInputChange}
                            />
                            <input
                                type='text'
                                placeholder='Username'
                                className='flex-1 input border border-gray-700 rounded p-2 input-md'
                                value={formData.username}
                                name='username'
                                onChange={handleInputChange}
                            />
                        </div>
                        <div className='flex flex-wrap gap-2'>
                            <input
                                type='email'
                                placeholder='Email'
                                className='flex-1 input border border-gray-700 rounded p-2 input-md'
                                value={formData.email}
                                name='email'
                                onChange={handleInputChange}
                            />
                            <textarea
                                placeholder='Bio'
                                className='flex-1 input border border-gray-700 rounded p-2 input-md'
                                value={formData.bio}
                                name='bio'
                                onChange={handleInputChange}
                            />
                        </div>
                        <div className='flex flex-wrap gap-2'>
                            <input
                                type='password'
                                placeholder='Current Password'
                                className='flex-1 input border border-gray-700 rounded p-2 input-md'
                                value={formData.currentPassword}
                                name='currentPassword'
                                onChange={handleInputChange}
                            />
                            <input
                                type='password'
                                placeholder='New Password'
                                className='flex-1 input border border-gray-700 rounded p-2 input-md'
                                value={formData.newPassword}
                                name='newPassword'
                                onChange={handleInputChange}
                            />
                        </div>
                        <input
                            type='text'
                            placeholder='Link'
                            className='flex-1 input border border-gray-700 rounded p-2 input-md'
                            value={formData.link}
                            name='link'
                            onChange={handleInputChange}
                        />
                        <button type="submit" className='btn btn-primary rounded-full btn-sm text-white'>Update</button>
                    </form>
                </div>
                <form method='dialog' className='modal-backdrop'>
                    <button className='outline-none'>close</button>
                </form>
            </dialog>
        </>
    );
};
export default EditProfileModal;