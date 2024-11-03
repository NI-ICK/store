"use client"

import { CartIcon } from "@/assets/CartIcon"
import { WishlistIcon } from "@/assets/WishlistIcon"
import { useCartStore } from "@/store/useCartStore"
import { useWishlistStore } from "@/store/useWishlistStore"
import { useEffect, useState } from "react"
import styles from '@/styles/modules/Products.module.scss'
import { useUserStore } from "@/store/useUserStore"

export function Buttons({ product }: { product: Product }) {
    const addCartItem = useCartStore(state => state.addCartItem)
    const addWishlistItem = useWishlistStore(state => state.addWishlistItem)
    const removeWishlistItem = useWishlistStore(state => state.removeWishlistItem)
    const wishlistItems = useWishlistStore(state => state.wishlistItems)
    const user = useUserStore(state => state.user)
    const [ inWishlist, setInWishlist ] = useState(false)

    useEffect(() => {
        const found = wishlistItems.find(item => item.id === product.id)
        if(found) setInWishlist(true)
    }, [wishlistItems])

    if(!user) return null

    return <>
        {!inWishlist ? <span onClick={(e) => {
            e.preventDefault()
            addWishlistItem(product)
            setInWishlist(true)
        }} tabIndex={0} onKeyDown={(e) => { if(e.key === "Enter") (e.target as HTMLDivElement).click() }}><WishlistIcon /></span> 
        : 
        <span onClick={(e) => {
            e.preventDefault()
            removeWishlistItem(product)
            setInWishlist(false)
        }} tabIndex={0} onKeyDown={(e) => { if(e.key === "Enter") (e.target as HTMLDivElement).click() }} className={styles.remove}><WishlistIcon /></span>
        }
        <span onClick={(e) => {
            e.preventDefault()
            addCartItem(product)
            }} tabIndex={0} onKeyDown={(e) => { if(e.key === "Enter") (e.target as HTMLDivElement).click() }}><CartIcon /></span>
    </>
}