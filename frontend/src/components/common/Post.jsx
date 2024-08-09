import { FaRegComment } from "react-icons/fa";
import { FaRegHeart } from "react-icons/fa";
import { FaTrash } from "react-icons/fa";
import { useRef, useState } from "react";
import { Link } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { useAuthContext } from '../../context/authContext'
const Post = ({ post }) => {
    const [comment, setComment] = useState("");
    const postOwner = post.user;

    const { user } = useAuthContext();

    const [isLiked, setIsLiked] = useState(post.likes?.includes(user?._id));
    const isMyPost = user?._id === post?.user?._id;

    const formattedDate = "1h";

    const commentsRef = useRef();

    const queryClient = useQueryClient();

    const { data: comments } = useQuery({
        queryKey: ["comments", post?._id],
        queryFn: async () => {
            try {
                const response = await fetch(`http://localhost:3000/api/v1/post/comments/${post?._id}`, {
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
    })

    const { mutate: commentOnPost, isPending: isCommenting } = useMutation({
        mutationFn: async (id) => {
            try {
                const response = await fetch(`http://localhost:3000/api/v1/post/comment/${id}`, {
                    method: "POST",
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    credentials: "include",
                    body: JSON.stringify({ text: comment })
                });
                const data = await response.json();

                if (!response.ok || data.error) {
                    throw new Error(data.error);
                }

                toast.success("Comment Added!")
                return data;
            } catch (err) {
                console.log(`Error in comment mutation: ${err.message}`);
                toast.error(err.message);
            }
        },
        onSuccess: () => {
            return queryClient.invalidateQueries({ queryKey: ["comments", post?._id] });
        }
    });

    const { mutate: deletePost } = useMutation({
        mutationFn: async (id) => {
            try {
                const response = await fetch(`http://localhost:3000/api/v1/post/${id}`, {
                    method: "DELETE",
                    credentials: "include"
                });
                const data = await response.json();

                if (!response.ok || data.error) {
                    throw new Error(data.error);
                }

                toast.success("Post deleted successfully");
                return data;
            } catch (err) {
                console.log(`Error in delete post mutation: ${err.message}`);
                toast.error(err.message);
            }
        },
        onSuccess: () => {
            return queryClient.invalidateQueries({ queryKey: ["all", "posts"] });
        }
    });

    const { mutate: likePost } = useMutation({
        mutationFn: async (id) => {
            try {
                const response = await fetch(`http://localhost:3000/api/v1/post/like/${id}`, {
                    method: "POST",
                    credentials: "include"
                });
                const data = await response.json();

                if (!response.ok || data.error) {
                    throw new Error(data.error);
                }

                toast.success(isLiked ? "Post Unliked" : "You liked a post");
                setIsLiked(!isLiked);

                return data;
            } catch (err) {
                console.log(`Error in like post mutation: ${err.message}`);
                toast.error(err.message);
            }
        },
        onSuccess: () => {
            return
        }
    });

    const handleCommentSubmit = (e) => {
        e.preventDefault();
        commentOnPost(post._id);
    }

    const handleDeletePost = () => {
        deletePost(post._id);
    };

    const handleLikePost = () => {
        likePost(post._id);
    };

    return (
        <>
            <div className='flex gap-2 items-start p-4 border-b border-gray-700'>
                <div className='avatar'>
                    <Link to={`/profile/${postOwner.username}`} className='w-8 rounded-full overflow-hidden'>
                        <img src={postOwner.profileImg || "/avatar-placeholder.png"} />
                    </Link>
                </div>
                <div className='flex flex-col flex-1'>
                    <div className='flex gap-2 items-center'>
                        <Link to={`/profile/${postOwner.username}`} className='font-bold'>
                            {postOwner.fullName}
                        </Link>
                        <span className='text-gray-700 flex gap-1 text-sm'>
                            <Link to={`/profile/${postOwner.username}`}>@{postOwner.username}</Link>
                            <span>·</span>
                            <span>{formattedDate}</span>
                        </span>
                        {isMyPost && (
                            <span className='flex justify-end flex-1'>
                                <FaTrash className='cursor-pointer hover:text-red-500' onClick={handleDeletePost} />
                            </span>
                        )}
                    </div>
                    <div className='flex flex-col gap-3 overflow-hidden'>
                        <span>{post.text}</span>
                        {post.img && (
                            <img
                                src={post.img}
                                className='h-80 object-contain rounded-lg border border-gray-700'
                                alt=''
                            />
                        )}
                    </div>
                    <div className='flex justify-between mt-3'>
                        <div className='flex gap-4 items-center w-2/3 justify-between'>
                            <div
                                className='flex gap-1 items-center cursor-pointer group'
                                onClick={() => commentsRef.current.showModal()}
                            >
                                <FaRegComment className='w-4 h-4  text-slate-500 group-hover:text-sky-400' />
                                <span className='text-sm text-slate-500 group-hover:text-sky-400'>
                                    {comments?.length}
                                </span>
                            </div>
                            {/* We're using Modal Component from DaisyUI */}
                            <dialog className='modal border-none outline-none' ref={commentsRef}>
                                <div className='modal-box rounded border border-gray-600'>
                                    <h3 className='font-bold text-lg mb-4'>COMMENTS</h3>
                                    <div className='flex flex-col gap-3 max-h-60 overflow-auto'>
                                        {comments?.length === 0 && (
                                            <p className='text-sm text-slate-500'>
                                                No comments yet 🤔 Be the first one 😉
                                            </p>
                                        )}
                                        {comments?.map((comment) => (
                                            <div key={comment._id} className='flex gap-2 items-start'>
                                                <div className='avatar'>
                                                    <div className='w-8 rounded-full'>
                                                        <img
                                                            src={comment.user.profileImg || "/avatar-placeholder.png"}
                                                        />
                                                    </div>
                                                </div>
                                                <div className='flex flex-col'>
                                                    <div className='flex items-center gap-1'>
                                                        <span className='font-bold'>{comment.user.fullName}</span>
                                                        <span className='text-gray-700 text-sm'>
                                                            @{comment.user.username}
                                                        </span>
                                                    </div>
                                                    <div className='text-sm'>{comment.text}</div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                    <form
                                        className='flex gap-2 items-center mt-4 border-t border-gray-600 pt-2'
                                        onSubmit={handleCommentSubmit}
                                    >
                                        <textarea
                                            className='textarea w-full p-1 rounded text-md resize-none border focus:outline-none  border-gray-800'
                                            placeholder='Add a comment...'
                                            value={comment}
                                            onChange={(e) => setComment(e.target.value)}
                                        />
                                        <button type="submit" className='btn btn-primary rounded-full btn-sm text-white px-4'>
                                            {isCommenting ? (
                                                <span className='loading loading-spinner loading-md'></span>
                                            ) : (
                                                "Post"
                                            )}
                                        </button>
                                    </form>
                                </div>
                                <form method='dialog' className='modal-backdrop'>
                                    <button className='outline-none'>close</button>
                                </form>
                            </dialog>
                            <div className='flex gap-1 items-center group cursor-pointer' onClick={handleLikePost}>
                                {!isLiked && (
                                    <FaRegHeart className='w-4 h-4 cursor-pointer text-slate-500 group-hover:text-pink-500' />
                                )}
                                {isLiked && <FaRegHeart className='w-4 h-4 cursor-pointer text-pink-500 ' />}

                                <span
                                    className={`text-sm text-slate-500 group-hover:text-pink-500 ${isLiked ? "text-pink-500" : ""
                                        }`}
                                >
                                    {post.likes.length}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Post;