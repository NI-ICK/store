"use client"

import { useState } from "react"
import styles from '@/styles/modules/Admin.module.scss'
import axios from "axios"

export function AdminRefundButton({ orderId, paymentIntentId, status }: { orderId: string, paymentIntentId: string, status: string }) {
    const [ showModal, setShowModal ] = useState(false)

    const handleRefund = async () => {
        try {     
            await axios.put('/api/orders', { orderId, paymentIntentId })
            setShowModal(false)
        } catch(error) {
            console.log(error)
        }
    }

    if(status === "Refunded") return null

    return <>
        <button onClick={() => setShowModal(true)}>Refund</button>
        {showModal && <div className={styles.backdrop} onClick={() => setShowModal(false)}>
            <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
                <p>Are you sure you want to refund this order ?</p>
                <div>
                    <button onClick={() => setShowModal(false)}>Close</button>
                    <button onClick={handleRefund}>Refund</button>
                </div>
            </div>
        </div>}
    </>
}