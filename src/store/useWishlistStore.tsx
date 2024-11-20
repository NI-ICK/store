import { fetchSingleProduct } from "@/utils/fetchData"
import { getUserFromToken } from "@/utils/getUserFromToken"
import axios from "axios"
import { create } from "zustand"

type Wishlist = {
    wishlistItems: Product[]
    userId: string | null
    addWishlistItem: (product: Product) => void
    removeWishlistItem: (product: Product) => void
    setUserId: () => void
    getWishlistItems: () => void
}

export const useWishlistStore = create<Wishlist>((set, get) => ({
    wishlistItems: [],
    userId: null,
    addWishlistItem: async (product) => {
        const state = get()
            
        axios.post('/api/wishlist/add', { productId: product.id, userId: state.userId })
        return set({ wishlistItems: [ ...state.wishlistItems, product ]}) 
    },
    removeWishlistItem: (product) => set(state => {            
        axios.post('/api/wishlist/remove', { productId: product.id, userId: state.userId })
        return { wishlistItems: state.wishlistItems.filter(item => item.id !== product.id )}
    }),
    setUserId: async () => {
        const user = await getUserFromToken()
        set({ userId: user?.id })
    },
    getWishlistItems: async () => {
        const state = get()
        if(!state.userId) return set({ wishlistItems: [] })

        const response = await axios.get('/api/wishlist', { params: { userId: state.userId }})
        if(!response.data.wishlist) return set({ wishlistItems: [] }) 

        const items = []
        const ids = response.data.wishlist.split(',').filter((id: string) => id !== '')
        for(const id of ids) {
            const product = await fetchSingleProduct(id)
            items.push(product)
        }
        return set({ wishlistItems: [ ...items ]}) 
    },
    }),
)