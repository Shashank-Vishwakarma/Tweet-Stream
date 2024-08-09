import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import toast from "react-hot-toast";

const useFollowOrUnfollow = () => {
    const queryClient = useQueryClient();

    const [text, setText] = useState("");
    const { mutate: followOrUnfollowUserMutation, isPending } = useMutation({
        mutationKey: ["follow", "unfollow"],
        mutationFn: async (id) => {
            try {
                const response = await fetch(`http://localhost:3000/api/v1/user/follow/${id}`, {
                    method: "POST",
                    credentials: "include"
                });
                const data = await response.json();

                if (!response.ok || data.error) {
                    throw new Error(data.error);
                }

                if (data?.message === "Unfollow successful") {
                    setText("Follow");
                } else if (data?.message === "Follow successful") {
                    setText("Unfollow");
                }

                toast.success(data.message);
                return data;
            } catch (err) {
                console.log(`Error in follow suggested user mutation hook: ${err.message}`);
                toast.error(err.message);
            }
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["suggested"] });
        }
    });

    return { followOrUnfollowUserMutation, isPending, text }
}

export default useFollowOrUnfollow;