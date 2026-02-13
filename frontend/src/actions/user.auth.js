import { create } from "zustand";

export const userAuth = create((set) => (
    {
        accessToken: null,
        user: {},
        favoriteCoins: [],

        setAccessToken: (accessToken) => set({accessToken}),
        setUser: (user) => set({user}),
        setFavoriteCoins: (favoriteCoins) => set({favoriteCoins}),

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
        },

        loginUser: async (logUser) => {
            if (!logUser.email || !logUser.password) {
                return {
                    success: false,
                    message: "provide all fields"
                }
            }

            const res = await fetch("/user/login", {
                method: "POST",
                headers: {"Content-type":"application/json"},
                body:JSON.stringify(logUser),
            })

            const data = await res.json();

            if (!res.ok) {
                return {success: false, message: data.message};
            }

            set({accessToken: data.accessToken});

            set({favoriteCoins: data.favoriteCoins});

            return {success: true, message: "you've been logged in"};
        },
    }
))
