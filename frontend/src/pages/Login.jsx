import { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { MdOutlineMail } from "react-icons/md";
import { MdPassword } from "react-icons/md";
import { useMutation } from '@tanstack/react-query'
import toast from "react-hot-toast";
import { useAuthContext } from "../context/authContext";

const Login = () => {
    const [formData, setFormData] = useState({
        username: "",
        password: "",
    });

    const navigateTo = useNavigate();

    const { setUser } = useAuthContext();

    const { mutate: loginMutation, isPending, isError, error } = useMutation({
        mutationFn: async ({ username, password }) => {
            try {
                const response = await fetch('http://localhost:3000/api/v1/auth/login', {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    credentials: "include",
                    body: JSON.stringify({ username, password })
                });

                if (!response.ok) {
                    toast.error(response.statusText)
                    throw new Error("Something went wrong in signup mutaion");
                }

                const data = await response.json();

                toast.success(data?.message);
                setUser(data?.user);
                navigateTo('/login');

                return data;
            } catch (err) {
                console.log(`Error in login: ${err.message}`);
            }
        },
        onSuccess: (data) => {
            toast.success("Login successful");
            setUser(data?.user);
            navigateTo("/");
        },
        onError: (error) => {
            toast.error(`Error in login: ${error.message}`);
            setUser(null);
        },
    })

    const handleSubmit = (e) => {
        e.preventDefault();
        loginMutation(formData);
    };

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    return (
        <div className='max-w-screen-xl mx-auto flex h-screen'>
            <div className='flex-1 flex flex-col justify-center items-center'>
                <form className='flex gap-4 flex-col' onSubmit={handleSubmit}>
                    <h1 className='text-4xl font-extrabold text-white'>{"Let's"} go.</h1>
                    <label className='input input-bordered rounded flex items-center gap-2'>
                        <MdOutlineMail />
                        <input
                            type='text'
                            className='grow'
                            placeholder='username'
                            name='username'
                            onChange={handleInputChange}
                            value={formData.username}
                        />
                    </label>

                    <label className='input input-bordered rounded flex items-center gap-2'>
                        <MdPassword />
                        <input
                            type='password'
                            className='grow'
                            placeholder='Password'
                            name='password'
                            onChange={handleInputChange}
                            value={formData.password}
                        />
                    </label>
                    <button className='btn rounded-full btn-primary text-white'>
                        {isPending ? "Loading..." : "Login"}
                    </button>
                    {isError && <p className='text-red-500'>Something went wrong: {error.message}</p>}
                </form>
                <div className='flex flex-col gap-2 mt-4'>
                    <p className='text-white text-lg'>{"Don't"} have an account?</p>
                    <Link to='/signup'>
                        <button className='btn rounded-full btn-primary text-white btn-outline w-full'>Sign up</button>
                    </Link>
                </div>
            </div>
        </div>
    );
};
export default Login;