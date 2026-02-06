import { create } from "zustand";

export const userAuth = create((set) => (
    {
        accessToken: null,
        user: {},

        setAccessToken: (accessToken) => set({accessToken}),
        setUser: (user) => set({user}),

        createUser: async (newUser) => {
            if (!newUser.name || !newUser.email || !newUser.password) {
                return {
                    success: false, 
                    message: "please fill all fields"
                }
            }

            const res = await fetch("/user/register", {
                method: "POST",
                headers: {"Content-type":"application/json"},
                body:JSON.stringify(newUser),
            })

            const data = await res.json();

            if (!res.ok) {
                return {success: false, message: data.message};
            }
            return {success: true, message: data.message};
        }
    }
))
