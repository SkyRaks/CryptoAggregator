import { create } from "zustand";

export const useCryptoAggregator = create((set) => (
    {
        coins: [],
        setCoins: (coins) => set({coins}),

        fetchCoins: async(exchange) => {

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