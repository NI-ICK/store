import { fetchUserOrders, fetchSingleProduct } from "@/utils/fetchData"
import styles from '@/styles/modules/User.module.scss'
import { getUserFromToken } from "@/utils/getUserFromToken"
import { ArrowIcon } from "@/assets/ArrowIcon"
import Link from "next/link"
import Image from "next/image"
import { ClearCart } from "./_components/ClearCart"

const fetchUserOrdersWithProducts = async (): Promise<Order[]> => {
    const user = await getUserFromToken()
    if(!user) return []

    const response = await fetchUserOrders(user.id)
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

export default async function Orders() {
    const orders = await fetchUserOrdersWithProducts()

    const handleMoreItems = (order: Order) => {
        return order.orderItems.length > 3 ? <p className={styles.more}>{order.orderItems.length - 3} More<ArrowIcon rotate={-90}/></p> : null
    } 
    
    const handleDate = (order: Order) => {
        const date = order.createdAt.toString().split('T')[0].replace(/-/g, '.')
        return <p>Order date <span>{date}</span></p>
    }

    return <>
        <ClearCart orders={orders}/>
        <div className={styles.orders}>
            <h2>Orders</h2>
            {orders && orders.map((order, index) => (
                <Link href={`/orders/${order.id}`} key={index} className={styles.order}>
                    <div className={styles.products}>
                        {order.orderItems.slice(0, 3).map((item, index) => (
                            <div key={index}>
                                <Image src={item.product.thumbnail} alt={item.product.title} width={64} height={64}/>
                                <p>{item.product.title}</p>
                            </div>
                        ))}
                        {handleMoreItems(order)}
                    </div>
                    <div className={styles.details}>
                        {handleDate(order)}
                        <p className={styles.totalPrice}>Total price<span>{'$ ' + order.totalPrice.toFixed(2)}</span></p>
                        <p className={`${styles.status} ${order.status === 'Refunded' ? styles.refunded : ''}`}>{order.status}</p>
                    </div>
                </Link>
            ))}
        </div>
    </>
}

