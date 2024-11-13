import styles from '@/styles/modules/Admin.module.scss'
import { fetchOrders, fetchSingleProduct } from '@/utils/fetchData'
import { getUserId } from '@/utils/getUserId'
import { AdminRefundButton } from './_components/AdminRefundButton'

const fetchOrdersWithProducts = async (): Promise<Order[]> => {
    const userId = await getUserId()
    if(!userId) return []

    const response = await fetchOrders(userId)
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
    const orders = await fetchOrdersWithProducts()

    const handleDate = (order: Order) => {
        const date = order.createdAt.toString().split('T')[0].replace(/-/g, '.')
        return <p>Order date: <span>{date}</span></p>
    }

    const handleTime = (order: Order) => {
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