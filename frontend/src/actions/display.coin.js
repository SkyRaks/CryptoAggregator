import { create } from "zustand";
import { userAuth } from "./user.auth";

export const useCryptoAggregator = create((set) => (
    {
        // coins: [],
        coins: {},
        setCoins: (coins) => set({coins}),

        fetchCoins: async(exchange) => {
            // http fetch

            try {
                const res = await fetch("/crypto-aggregator", {
                    method: "POST",
                    headers: {
                        "Content-type":"application/json"
                    },
                    body:JSON.stringify({ exchange })
                });
                
                const result = await res.json();
                set({coins: result.data});   
            } catch (error) {
                console.error("fetch failed", error);
            }
        },

        addFavorite: async(symbol, exchange) => {
            try {
                const accessToken = userAuth.getState().accessToken;
                
                await fetch("/crypto-aggregator/add-favorite", {
                    method: "POST",
                    headers: {
                        "Content-type": "application/json",
                        "Authorization": `Bearer ${accessToken}`
                    },
                    body:JSON.stringify({symbol, exchange})
                });
            } catch (error) {
                console.error("add favorite failed", error.message);
            }
        },

        removeFavorite: async(symbol, exchange) => {
            try {
                const accessToken = userAuth.getState().accessToken;

                await fetch("/crypto-aggregator/remove-favorite", {
                    method: "DELETE",
                    headers: {
                        "Content-type": "application/json",
                        "Authorization": `Bearer ${accessToken}`
                    },
                    body:JSON.stringify({symbol, exchange})
                });
            } catch (error) {
                console.error("remove favorite failed", error);
            }
        }
    }
))