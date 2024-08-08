import Post from "./Post";
import PostSkeleton from "../skeletons/PostSkeleton";
import { POSTS } from "../../utils/db/dummy.js";
import { useQuery } from "@tanstack/react-query";
import toast from "react-hot-toast";

const Posts = () => {
    const { isLoading, data: posts } = useQuery({
        queryKey: ["posts"],
        queryFn: async () => {
            try {
                const response = await fetch("http://localhost:3000/api/v1/post/all", {
                    credentials: "include"
                });
                const data = await response.json();
                return data;
            } catch (err) {
                toast.error(err.message);
                console.log(`Error in Posts query: ${err.message}`);
            }
        }
    });

    console.log(posts);

    return (
        <>
            {isLoading && (
                <div className='flex flex-col justify-center'>
                    <PostSkeleton />
                    <PostSkeleton />
                    <PostSkeleton />
                </div>
            )}
            {!isLoading && posts?.length === 0 && <p className='text-center my-4'>No posts in this tab. Switch 👻</p>}
            {!isLoading && posts && (
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