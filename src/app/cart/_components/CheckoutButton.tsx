"use client"

import { loadStripe } from '@stripe/stripe-js'
import { EmbeddedCheckoutProvider, EmbeddedCheckout } from '@stripe/react-stripe-js'
import { useState } from 'react'
import { useCartStore } from '@/store/useCartStore'
import styles from '@/styles/modules/Cart.module.scss'
import { useUserStore } from '@/store/useUserStore'
import axios from 'axios'

export function CheckoutButton() {
    const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_KEY!)
    const cartItems = useCartStore(state => state.cartItems)
    const user = useUserStore(state => state.user)
    const [ showModal, setShowModal ] = useState(false)
    const [ clientSecret, setClientSecret ] = useState('')

    const handleCheckout = async () => {
        try {
            const response = await axios.post('/api/checkout', { cartItems, userId: user?.id })
            setClientSecret(response.data.session.client_secret)
            setShowModal(true)
        } catch(error) {
            console.log(error)
        }
    }

    return <>
        {showModal && 
            <div className={styles.background} onClick={() => setShowModal(false)}>
                <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
                    <div className={styles.content}>
                        <ul className={styles.info}>
                            <li>To simulate a transaction, please enter one of the following card numbers:</li>
                            <li>Successful Transaction: <span>4242 4242 4242 4242</span></li>
                            <li>Additional Authentication Required: <span>4000 0025 0000 3155</span></li>
                            <li>Transaction Declined: <span>4000 0000 0000 9995</span></li>
                        </ul>
                        <EmbeddedCheckoutProvider stripe={stripePromise} options={{ clientSecret }}>
                            <EmbeddedCheckout />
                        </EmbeddedCheckoutProvider>
                        <div className={styles.cancel} >
                            <button onClick={() => setShowModal(false)}>Cancel</button>
                        </div>
                    </div>
                </div>
            </div>
        }
        <button onClick={handleCheckout}>Checkout</button>
    </>
}