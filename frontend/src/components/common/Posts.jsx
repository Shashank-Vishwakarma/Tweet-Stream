import Post from "./Post";
import PostSkeleton from "../skeletons/PostSkeleton";
import { useEffect, useState } from "react";

const Posts = ({ feedType }) => {
    const [posts, setPosts] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const getPosts = async () => {
            let url = "";
            if (feedType === "forYou") {
                url = "http://localhost:3000/api/v1/post/all"
            } else {
                url = "http://localhost:3000/api/v1/post/following"
            }

            setIsLoading(true);
            try {
                const response = await fetch(url, { credentials: "include" });
                const data = await response.json();

                setPosts(data);
                setIsLoading(isLoading);
            } catch (err) {
                toast.error(err.message);
                console.log(`Error in Posts query: ${err.message}`);
            } finally {
                setIsLoading(false);
            }
        }

        getPosts();
    }, [feedType]);

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