"use client"

import { CartIcon } from '@/assets/CartIcon'
import { WishlistIcon } from '@/assets/WishlistIcon'
import { useCart } from '@/store/useCart'
import { useWishlist } from '@/store/useWishlist'
import { useEffect, useState } from 'react'
import styles from '@/styles/modules/ProductDetails.module.scss'

export function Buttons({ product }: { product: Product }) {
    const addCartItem = useCart(state => state.addCartItem)
    const addWishlistItem = useWishlist(state => state.addWishlistItem)
    const removeWishlistItem = useWishlist(state => state.removeWishlistItem)
    const wishlistItems = useWishlist(state => state.wishlistItems)
    const [ inWishlist, setInWishlist ] = useState(false)

    useEffect(() => {
        const found = wishlistItems.find(item => item.id === product.id)
        if(found) setInWishlist(true)
    }, [wishlistItems])

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
            <div className={styles.wrapper}>
                <div tabIndex={0} className={styles.cartBtn} onClick={() => addCartItem(product)} onKeyDown={(e) => { if(e.key === "Enter") (e.target as HTMLDivElement).click() }}>
                    <span>
                        <CartIcon />
                    </span>
                    <p>Add to Cart</p>
                </div>
                <p className={styles.stock}>In stock: {product.stock}</p>
            </div>
        </div>
    </>
}