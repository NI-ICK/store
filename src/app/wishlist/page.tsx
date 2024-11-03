"use client"

import { CartIcon } from '@/assets/CartIcon'
import { XIcon } from '@/assets/XIcon'
import { useCartStore } from '@/store/useCartStore'
import { useWishlistStore } from '@/store/useWishlistStore'
import styles from '@/styles/modules/Wishlist.module.scss'
import Image from 'next/image'
import Link from 'next/link'

export default function Wishlist() {
    const wishlistItems = useWishlistStore(state => state.wishlistItems)
    const removeWishlistItem = useWishlistStore(state => state.removeWishlistItem)
    const addCartItem = useCartStore(state => state.addCartItem)
    
    const handleProductPrice = (product: Product) => {
        return '$ ' + (product.price * (1 - product.discountPercentage / 100)).toFixed(2)
    }

    return <>
        <div className={styles.container}>
            <div className={styles.wishlist}>
                <div className={styles.items}>
                {wishlistItems.map((item, index) => {
                    return (
                    <div key={index} className={styles.product}>
                        <Link href={`/products/${item.id}`} tabIndex={-1}><Image src={item.thumbnail} alt={item.title} width={112} height={112}/></Link>
                        <div>
                            <div className={styles.details}>
                                <Link href={`/products/${item.id}`}><h3>{item.title}</h3></Link>
                                <p>{handleProductPrice(item)}</p>
                            </div>
                            <div className={styles.info}>
                                <button onClick={() => addCartItem(item)}><CartIcon /></button>
                                <button onClick={() => removeWishlistItem(item)}><XIcon /></button>
                            </div>
                        </div>
                    </div>
                )})}
                </div>
            </div>
        </div>
    </>
}