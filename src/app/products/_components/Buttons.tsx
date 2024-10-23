"use client"

import { CartIcon } from "@/assets/CartIcon"
import { WishlistIcon } from "@/assets/WishlistIcon"
import { useCart } from "@/store/useCart"
import { useWishlist } from "@/store/useWishlist"
import { useEffect, useState } from "react"
import styles from '@/styles/modules/Products.module.scss'

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