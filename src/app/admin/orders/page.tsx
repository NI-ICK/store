import styles from '@/styles/modules/Admin.module.scss'
import { fetchAllOrders, fetchSingleProduct } from '@/utils/fetchData'
import { AdminRefundButton } from './_components/AdminRefundButton'
import { cookies } from 'next/headers'

const fetchUserOrdersWithProducts = async (): Promise<Order[]> => {
    const response = await fetchAllOrders()

    if(!response) return []
    
    return await Promise.all(
        response.orders.map(async (order: Order) => {
            const ordersWithProducts = await Promise.all(
                order.orderItems.map(async (item) => {
                    const product = await fetchSingleProduct(item.productId)
                    return { ...item, product }
                })
            )
            return { ...order, orderItems: ordersWithProducts }
        })
    )
}

export default async function OrderPage() {
    const orders = await fetchUserOrdersWithProducts()
    cookies()
    const handleDate = (order: Order) => { // Works only for MySQL CURRENT_TIMESTAMP
        const date = order.createdAt.toString().split('T')[0].replace(/-/g, '.')
        return <p>Order date: <span>{date}</span></p>
    }

    const handleTime = (order: Order) => { // Works only for MySQL CURRENT_TIMESTAMP
        const time = order.createdAt.toString().split('T')[1].slice(0, -5)
        return <p>Order time: <span>{time}</span></p>
    }

    return <>
        <div className={styles.orders}>
            {orders.map((order, index) => (
                <div key={index} className={styles.order}>
                    <div className={styles.content}>
                        <p>Order ID: <span>{order.id}</span></p>
                        <p>User ID: <span>{order.userId}</span></p>
                        {handleDate(order)}
                        {handleTime(order)}
                        <p>Total price: <span>$ {order.totalPrice.toFixed(2)}</span></p>
                        <p>Status: <span>{order.status}</span></p>
                        <p>Items: </p>
                        {order.orderItems.map((item, index) => (
                            <p key={index} className={styles.item}>{item.product.title} x {item.quantity}</p>
                        ))}
                    </div>
                    <AdminRefundButton orderId={order.id} paymentIntentId={order.paymentIntentId} status={order.status}/>
                </div>
            ))}
        </div>
    </>
}