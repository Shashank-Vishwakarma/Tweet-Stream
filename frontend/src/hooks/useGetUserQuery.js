import { useQuery } from "@tanstack/react-query";

export const useGetUserQuery = () => {
    const { user, setUser } = useAuthContext();

    const { data } = useQuery({
        queryKey: ["authUser"],
        queryFn: async () => {
            try {
                const response = await fetch("http://localhost:3000/api/v1/auth/me", {
                    credentials: "include",
                });

                const data = await response.json();
                return data
            } catch (err) {
                console.log(`Error in getting current user: ${err.message}`);
            }
        }
    });

    if (!user?.error) {
        setUser(data);
    } else {
        setUser(null)
    }

    return { user };
}