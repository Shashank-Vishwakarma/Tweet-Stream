import Post from "./Post";
import PostSkeleton from "../skeletons/PostSkeleton";
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAuthContext } from "../../context/authContext";

const Posts = ({ feedType, username = "" }) => {
    const { user } = useAuthContext();

    const getUrl = () => {
        switch (feedType) {
            case "following":
                return "http://localhost:3000/api/v1/post/following";
            case "posts":
                return `http://localhost:3000/api/v1/post/user/${username}`;
            case "likes":
                return `http://localhost:3000/api/v1/post/likes/${user?._id}`;
            case "forYou":
                return "http://localhost:3000/api/v1/post/all";
            default:
                return "http://localhost:3000/api/v1/post/all"
        }
    }

    const POST_URL = getUrl();
    const { isLoading, data: posts, refetch, isRefetching } = useQuery({
        queryKey: ["all", "posts"],
        queryFn: async () => {
            try {
                const response = await fetch(POST_URL, {
                    credentials: "include",
                });
                const data = await response.json();

                if (!response.ok || data.error) {
                    throw new Error(data.error);
                }

                return data;
            } catch (err) {
                console.log(`Error in get comments query: ${err.message}`);
                toast.error(err.message);
            }
        }
    });

    useEffect(() => {
        refetch();
    }, [feedType, refetch]);

    return (
        <>
            {isLoading || isRefetching && (
                <div className='flex flex-col justify-center'>
                    <PostSkeleton />
                    <PostSkeleton />
                    <PostSkeleton />
                </div>
            )}
            {!isLoading && !isRefetching && posts?.length === 0 && <p className='text-center my-4'>No posts in this tab. Switch 👻</p>}
            {!isLoading && !isRefetching && posts && (
                <div>
                    {posts?.map((post) => (
                        <Post key={post._id} post={post} />
                    ))}
                </div>
            )}
        </>
    );
};
export default Posts;