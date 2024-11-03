"use client"

import { CartIcon } from '@/assets/CartIcon'
import { WishlistIcon } from '@/assets/WishlistIcon'
import { useCartStore } from '@/store/useCartStore'
import { useWishlistStore } from '@/store/useWishlistStore'
import { useEffect, useState } from 'react'
import styles from '@/styles/modules/ProductDetails.module.scss'
import { useUserStore } from '@/store/useUserStore'
import { XIcon } from '@/assets/XIcon'

type CartItem = Product & {
    quantity: number
}

export function Buttons({ product }: { product: Product }) {
    const cartItems = useCartStore(state => state.cartItems)
    const addCartItem = useCartStore(state => state.addCartItem)
    const removeCartItem = useCartStore(state => state.removeCartItem)
    const changeItemQuantiy = useCartStore(state => state.changeItemQuantiy)
    const addWishlistItem = useWishlistStore(state => state.addWishlistItem)
    const removeWishlistItem = useWishlistStore(state => state.removeWishlistItem)
    const wishlistItems = useWishlistStore(state => state.wishlistItems)
    const user = useUserStore(state => state.user)
    const [ inWishlist, setInWishlist ] = useState(false)
    const [ itemInCart, setItemInCart ] = useState<CartItem | null>(null) 

    useEffect(() => {   
        const found = wishlistItems.find(item => item.id === product.id)
        if(found) setInWishlist(true)
    }, [wishlistItems])

    useEffect(() => {
        const item = cartItems.find(item => item.id === product.id)
        if(item) setItemInCart(item)
    }, [cartItems])

    if(!user) return null

    return <>
        <div className={styles.buttons}>
            {!inWishlist ? (<div tabIndex={0} className={styles.wishlistBtn} onClick={() => { addWishlistItem(product), setInWishlist(true) }} onKeyDown={(e) => { if(e.key === "Enter") (e.target as HTMLDivElement).click() }}>
                <span>
                    <WishlistIcon />
                </span>
                <p>Add to Wishlist</p>
            </div> ) : (
            <div tabIndex={0} className={styles.wishlistBtn} onClick={() => { removeWishlistItem(product), setInWishlist(false) }} onKeyDown={(e) => { if(e.key === "Enter") (e.target as HTMLDivElement).click() }}>
                <span className={styles.remove}>
                    <WishlistIcon />
                </span>
                <p>Remove from Wishlist</p>
            </div>)}
            {!itemInCart ? (<div className={styles.wrapper}>
                <div tabIndex={0} className={styles.cartBtn} onClick={() => addCartItem(product)} onKeyDown={(e) => { if(e.key === "Enter") (e.target as HTMLDivElement).click() }}>
                    <span>
                        <CartIcon />
                    </span>
                    <p>Add to Cart</p>
                </div>
                <p className={styles.stock}>In stock: {product.stock}</p>
            </div> ) : (
            <div className={styles.wrapper}>
                <div className={styles.cartBtn}>
                    <span>
                        <CartIcon />
                    </span>
                    <p>In cart: </p>
                    <input type="number" value={itemInCart.quantity} onChange={(e) => { 
                        if(Number(e.target.value) <= 99 && Number(e.target.value) !== 0) changeItemQuantiy(itemInCart, Number(e.target.value)) 
                        if(Number(e.target.value) > 99 && Number(e.target.value) !== 0) changeItemQuantiy(itemInCart, 99)  
                        }}/>
                </div>
                <span className={styles.remove} tabIndex={0} onClick={() => { removeCartItem(product), setItemInCart(null) }} onKeyDown={(e) => { if(e.key === "Enter") (e.target as HTMLDivElement).click() }}>
                    <XIcon />
                </span>
                <p className={styles.stock}>In stock: {product.stock}</p>
            </div>)}
        </div> 
    </>
}