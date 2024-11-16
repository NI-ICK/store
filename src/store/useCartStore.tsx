import { getUserId } from "@/utils/getUserId"
import { create } from "zustand"
import { persist, PersistOptions } from "zustand/middleware"

type CartItem = Product & {
    quantity: number
}

type Cart = {
    cartItems: CartItem[] 
    totalPrice: number
    addCartItem: (product: Product) => void 
    removeCartItem: (product: Product) => void 
    changeItemQuantiy: (product: CartItem, newQuantity: number) => void
    emptyCartItems: () => void
}

const calculateTotalPrice = (cartItems: CartItem[]) => {
    return parseFloat(cartItems.reduce((total, cartItem) => {
        const discountedPrice =  cartItem.price * (1 - cartItem.discountPercentage / 100)
        return Math.ceil((total + discountedPrice * cartItem.quantity) * 100) / 100
    }, 0).toFixed(2))
}

export const useCartStore = create(persist((set) => ({
        cartItems: [],
        totalPrice: 0,
        addCartItem: (product) => set(state => {
            const existingItem = state.cartItems.find(cartItem => cartItem.id === product.id)
            const updatedCartItems =  [...state.cartItems, { ...product, quantity: 1 }]

            if(existingItem) return { 
                totalPrice: calculateTotalPrice([...state.cartItems, existingItem]),
                cartItems: state.cartItems.map(cartItem => cartItem.id === product.id ? { ...cartItem, quantity: cartItem.quantity + 1 } : cartItem)
            }

            return { cartItems: updatedCartItems,  totalPrice: calculateTotalPrice(updatedCartItems) }
        }),
        removeCartItem: (product) => set(state => {
            const foundProduct = state.cartItems.find(cartItem => cartItem.id === product.id)
            if(foundProduct) {
                const updatedCartItems = state.cartItems.filter(cartItem => cartItem.id !== foundProduct.id)
                return { 
                    totalPrice: calculateTotalPrice(updatedCartItems),
                    cartItems: updatedCartItems}
            }
            return state
        }),
        changeItemQuantiy: (product, newQuantity) => set(state => {
            const updatedCartItems = state.cartItems.map(cartItem => cartItem.id === product.id ? { ...cartItem, quantity: Math.max(newQuantity, 0) } : cartItem)
            return { 
                cartItems: updatedCartItems,
                totalPrice: calculateTotalPrice(updatedCartItems),
            }
        }),
        emptyCartItems: () => set({ cartItems: [], totalPrice: 0 })
    }),
    {
        name: `cart-${await getUserId()}`,
        getStorage: () => localStorage, 
    } as PersistOptions<Cart>
)) 