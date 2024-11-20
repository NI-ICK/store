import { fetchSingleProduct } from "@/utils/fetchData"
import { getUserFromToken } from "@/utils/getUserFromToken"
import axios from "axios"
import { create } from "zustand"

type CartItem = Product & {
    quantity: number
}

type Cart = {
    cartItems: CartItem[] 
    totalPrice: number
    userId: string | null
    addCartItem: (product: Product) => void 
    removeCartItem: (product: Product) => void 
    changeItemQuantiy: (product: CartItem, newQuantity: number) => void
    emptyCartItems: () => void
    setUserId: () => void
    getCartItems: () => void
}

const calculateTotalPrice = (cartItems: CartItem[]) => {
    return parseFloat(cartItems.reduce((total, cartItem) => {
        const discountedPrice =  cartItem.price * (1 - cartItem.discountPercentage / 100)
        return Math.ceil((total + discountedPrice * cartItem.quantity) * 100) / 100
    }, 0).toFixed(2))
}

export const useCartStore = create<Cart>((set, get) => ({
    cartItems: [],
    totalPrice: 0,
    userId: null,
    addCartItem: async (product) => {
        const state = get()

        const updatedCartItems = [...state.cartItems, { ...product, quantity: 1 }]
        const existingItem = state.cartItems.find(cartItem => cartItem.id === product.id)
        if(existingItem) {
            axios.post("/api/cart/update", { productId: existingItem.id, userId: state.userId }) 

            set({ 
                totalPrice: calculateTotalPrice([...state.cartItems, existingItem]), 
                cartItems: state.cartItems.map(cartItem => cartItem.id === product.id ? { ...cartItem, quantity: cartItem.quantity + 1 } : cartItem)
            })
        }

        axios.post("/api/cart/add", { productId: product.id, userId: state.userId }) 
        set({ totalPrice: calculateTotalPrice(updatedCartItems), cartItems: updatedCartItems })
    },
    removeCartItem: async (product) => {
        const state = get()

        const foundProduct = state.cartItems.find(cartItem => cartItem.id === product.id)
        if(foundProduct) {
            const updatedCartItems = state.cartItems.filter(cartItem => cartItem.id !== foundProduct.id)
            axios.post("/api/cart/remove", { productId: product.id, userId: state.userId }) 

            set({ totalPrice: calculateTotalPrice(updatedCartItems), cartItems: updatedCartItems })
        }
    },
    changeItemQuantiy: async (product, newQuantity) => {
        const state = get()

        axios.post("/api/cart/update", { productId: product.id, userId: state.userId, newQuantity }) 

        const updatedCartItems = state.cartItems.map(cartItem => cartItem.id === product.id ? { ...cartItem, quantity: Math.max(newQuantity, 0) } : cartItem)

        set({ totalPrice: calculateTotalPrice(updatedCartItems), cartItems: updatedCartItems })
    },
    emptyCartItems: () => set({ cartItems: [], totalPrice: 0 }),
    setUserId: async () => {
        const user = await getUserFromToken()
        set({ userId: user?.id })
    },
    getCartItems: async () => {
        const state = get()
        if(!state.userId) return set({ cartItems: [] })

        const response = await axios.get('/api/cart', { params: { userId: state.userId }})
        if(!response.data.cart) return set({ cartItems: [] }) 

        const items = []
        const values = response.data.cart.split(',').filter((id: string) => id !== '')
        for(const value of values) {
            const id = value.split('x')[0]
            const quantity = value.split('x')[1]
            const product = await fetchSingleProduct(id)
            items.push({ ...product, quantity })
        }
        return set({ cartItems: [ ...items ]}) 
    },
    }),
)
