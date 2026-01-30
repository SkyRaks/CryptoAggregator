import { create } from "zustand";

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
    }
))