import { create } from "zustand";

export const userAuth = create((set, get) => (
    {
        accessToken: null,
        user: {},
        favoriteCoins: [],
        favoriteData: [],

        setAccessToken: (accessToken) => set({accessToken}),
        setUser: (user) => set({user}),
        setFavoriteCoins: (favoriteCoins) => set({favoriteCoins}),
        setFavoriteData: (favoriteData) => set({favoriteData}),

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

            set({user: data.user})

            set({favoriteCoins: data.favoriteCoins});

            return {success: true, message: "you've been logged in"};
        },

        addPhoneNumber: async (phone) => {
            const accessToken = get().accessToken;
            if (!phone) {
                return {success: false, message: "provide phone Number"}
            }

            try {
                const res = await fetch("/user/add-phone-number", {
                    method: "POST",
                    headers: {
                        "Content-type":"application/json",
                        "Authorization": `Bearer ${accessToken}`
                    },
                    body:JSON.stringify({phone}),
                });

                const data = await res.json();

                if (!res.ok) {
                    return {success: false, message: data.message};
                }
                return {success: true, message: data.message};   
            } catch (error) {
                console.error("add phone number failed", error.message);
            }
        },

        deletePhoneNumber: async () => {
            const accessToken = get().accessToken;

            try {
                const res = await fetch("/user/delete-phone-number", {
                    method: "POST",
                    headers: {
                        "Content-type":"application/json",
                        "Authorization": `Bearer ${accessToken}`                        
                    }
                })

                const data = await res.json()

                if (!res.ok) {
                    return {success: false, message: data.message};
                }
                return {success: true, message: data.message};
            } catch (error) {
                console.error("delete phone number failed", error.message);
            }
        }
    }
))
