"use client"

import { XIcon } from "@/assets/XIcon"
import { CheckoutButton } from "@/app/cart/_components/CheckoutButton"
import { useCartStore } from "@/store/useCartStore"
import styles from '@/styles/modules/Cart.module.scss'
import Image from "next/image"
import Link from "next/link"

export default function Cart() {
    const cartItems = useCartStore(state => state.cartItems)
    const totalPrice = useCartStore(state => state.totalPrice)
    const removeCartItem = useCartStore(state => state.removeCartItem)
    const changeItemQuantiy = useCartStore(state => state.changeItemQuantiy)

    const handleProductPrice = (product: Product) => {
        return <span>{'$ ' + (product.price - (product.price * (product.discountPercentage / 100))).toFixed(2)}</span>
    }

    return <>
        <div className={styles.container}>
            <div className={styles.cart}>
                <div className={styles.cartItems}>
                {cartItems.map((cartItem, index) => {
                    return (
                    <div key={index} className={styles.product}>
                        <Link href={`/products/${cartItem.id}`} tabIndex={-1}><Image src={cartItem.thumbnail} alt={cartItem.title} width={112} height={112}/></Link>
                        <div>
                            <div className={styles.details}>
                                <Link href={`/products/${cartItem.id}`}><h3>{cartItem.title}</h3></Link>
                                <p>Price: {handleProductPrice(cartItem)}</p>
                            </div>
                            <div className={styles.info}>
                                <input type="number" value={cartItem.quantity} onChange={(e) => { 
                                    if(Number(e.target.value) <= 99 && Number(e.target.value) !== 0 && Number(e.target.value) <= cartItem.stock) changeItemQuantiy(cartItem, Number(e.target.value)) 
                                    if(Number(e.target.value) > cartItem.stock && Number(e.target.value) !== 0) changeItemQuantiy(cartItem, cartItem.stock)  
                                    }}/>
                                <button onClick={() => removeCartItem(cartItem)}><XIcon /></button>
                            </div>
                        </div>
                    </div>
                )})}
                </div>
                <div className={styles.footer}>
                    <p className={styles.price}>{'$ ' + totalPrice}</p>
                    <CheckoutButton />
                </div>
            </div>
        </div>
    </>
}