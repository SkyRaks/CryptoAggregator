import { create } from "zustand";
import { userAuth } from "./user.auth";
import { API_URL } from "../api.js";

export const useCryptoAggregator = create((set) => (
    {
        // coins: [],
        coins: {},
        setCoins: (coins) => set({coins}),

        fetchCoins: async(exchange) => {
            // http fetch
            try {
                const res = await fetch(`${API_URL}/crypto-aggregator`, {
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
                
                await fetch(`${API_URL}/crypto-aggregator/add-favorite`, {
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

                await fetch(`${API_URL}/crypto-aggregator/remove-favorite`, {
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
        },

        createAlert: async({favCoinSymbol, favCoinExchange, amount, sign}) => {
            try {
                const accessToken = userAuth.getState().accessToken;

                const res = await fetch(`${API_URL}/crypto-aggregator/create-alert`, {
                    method: "POST",
                    headers: {
                        "Content-type": "application/json",
                        "Authorization": `Bearer ${accessToken}`
                    },
                    body:JSON.stringify({favCoinSymbol, favCoinExchange, amount, sign})
                });
                const data = await res.json();

                console.log("res success: ", res.success);

                if (!res.ok) return {success: false, message: data.message};

                return {success: true, message: data.message};
            } catch (error) {
                console.error("create alert hook error", error.message);
            }
        }
    }
))