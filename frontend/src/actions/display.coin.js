import { create } from "zustand";

export const useCryptoAggregator = create((set) => (
    {
        coins: [],
        setCoins: (coins) => set({coins}),

        fetchCoins: async() => {
            try {
                const res = await fetch("/crypto-aggregator");

                const result = await res.json();
                set({coins: result.data});   
                console.log("data backend", data);
            } catch (error) {
                console.error("fetch failed", error);
            }
        },
    }
))