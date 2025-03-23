import { fetchSingleOrder, fetchSingleProduct } from "@/utils/fetchData"
import styles from '@/styles/modules/Order.module.scss'
import Link from "next/link"
import { RefundButton } from "./_components/RefundButton"
import { notFound } from "next/navigation"
import Image from "next/image"

const fetchSingleOrderWithProducts = async (id: string): Promise<Order | null> => {
    if(!id) return null

    const response = await fetchSingleOrder(id)
    if(!response) return null
    const orderItemsWithProducts = await Promise.all(
        response.orderItems.map(async (item: OrderItem) => {
            const product = await fetchSingleProduct(item.productId)
            return { ...item, product }
        })
    )
    return { ...response, orderItems: orderItemsWithProducts}
}

export default async function OrderPage(props: { params: { id: string }}) {
    const params = await props.params
    const order: Order | null = await fetchSingleOrderWithProducts(params.id)
    if(!order) notFound()

    const handleDate = (order: Order) => { // Works only for MySQL CURRENT_TIMESTAMP
        const date = order.createdAt.toString().split('T')[0].replace(/-/g, '.')
        return <p>Order date <span>{date}</span></p>
    }

    const handleProductPrice = (product: Product, quantity: number) => {
        const price = (product.price - (product.price * (product.discountPercentage / 100)))
        return <span>{'$ ' + price.toFixed(2)}{quantity > 1 ? ` ($${(price * quantity).toFixed(2)})` : ''}</span>
    }

    return <>
        <div className={styles.background}>
            <div className={styles.container}>
                <div className={styles.products}>
                {order.orderItems.map((order, index) => (
                    <div key={index} className={styles.product}>
                        <Image src={order.product.thumbnail} alt={order.product.title} width={160} height={160}/>
                        <div className={styles.productDetails}>
                            <Link href={`/products/${order.product.id}`}>{order.product.title}</Link>
                            <p className={styles.quantity}>Quantity: <span>{order.quantity}</span></p>
                            <p className={styles.price}>Price paid: {handleProductPrice(order.product, order.quantity)}</p>
                        </div>
                    </div>
                ))}
                </div>
                <div className={styles.orderDetails}>
                    {handleDate(order)}
                    <p className={styles.totalPrice}>Total price<span>{'$ ' + order.totalPrice.toFixed(2)}</span></p>
                    <p className={styles.status}>Status <span>{order.status}</span></p>
                    <RefundButton orderId={order.id} paymentIntentId={order.paymentIntentId} status={order.status}/>
                </div>
            </div>
        </div>
    </> 
} 