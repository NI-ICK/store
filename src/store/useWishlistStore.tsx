import { create } from "zustand"
import { persist, PersistOptions } from "zustand/middleware"

type Wishlist = {
    wishlistItems: Product[]
    addWishlistItem: (product: Product) => void
    removeWishlistItem: (product: Product) => void
}

export const useWishlistStore = create(persist(set => ({
        wishlistItems: [],
        addWishlistItem: (product) => set(state => {
            const foundProduct = state.wishlistItems.find(item => item.id === product.id)
        
            if(foundProduct) return state
            return { wishlistItems: [ ...state.wishlistItems, { ...product }]}
        }),
        removeWishlistItem: (product) => set(state => {
            const foundProduct = state.wishlistItems.find(item => item.id === product.id)
            
            if(!foundProduct) return state
            return { wishlistItems: state.wishlistItems.filter(item => item.id !== foundProduct.id )}
        })
    }),
    {
        name: 'wishlist-storage',
        getStorage: () => localStorage,
    } as PersistOptions<Wishlist>
))