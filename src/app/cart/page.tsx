"use client"

import { XIcon } from "@/assets/XIcon"
import { useCart } from "@/store/useCart"
import styles from '@/styles/modules/Cart.module.scss'
import Image from "next/image"
import Link from "next/link"

export default function Cart() {
    const cartItems = useCart(state => state.cartItems)
    const totalPrice = useCart(state => state.totalPrice)
    const removeCartItem = useCart(state => state.removeCartItem)
    const changeItemQuantiy = useCart(state => state.changeItemQuantiy)

    const handleProductPrice = (product: Product) => {
        return '$ ' + (product.price * (1 - product.discountPercentage / 100)).toFixed(2)
    }

    return <>
        <div className={styles.container}>
            <div className={styles.cart}>
                <div className={styles.cartItems}>
                {cartItems.map((cartItem, index) => {
                    return (
                    <div key={index} className={styles.product}>
                        <Link href={`/products/${cartItem.id}`}><Image src={cartItem.thumbnail} alt={cartItem.title} width={112} height={112}/></Link>
                        <div>
                            <div className={styles.details}>
                                <Link href={`/products/${cartItem.id}`}><h3>{cartItem.title}</h3></Link>
                                <p>{handleProductPrice(cartItem)}</p>
                            </div>
                            <div className={styles.info}>
                                <input type="number" value={cartItem.quantity} onChange={(e) => { 
                                    if(Number(e.target.value) <= 99) changeItemQuantiy(cartItem, Number(e.target.value)) 
                                    if(Number(e.target.value) > 99) changeItemQuantiy(cartItem, 99)  
                                    }}/>
                                <button onClick={() => removeCartItem(cartItem)}><XIcon /></button>
                            </div>
                        </div>
                    </div>
                )})}
                </div>
                <div className={styles.footer}>
                    <p>{'$ ' + totalPrice}</p>
                    <button>Checkout</button>
                </div>
            </div>
        </div>
    </>
}