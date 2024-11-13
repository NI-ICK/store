import styles from '@/styles/modules/Admin.module.scss'
import { fetchAdminData } from '@/utils/fetchData'

type Data = {
    orderCount: number
    userCount: number
    adminUserCount: number
    totalOrderPrice: number
    statusData: StatusData[]
}

type StatusData = {
    status: string
    statusCount: number
}

export default async function Dashboard() {
    const productCount = 194 // The only way to get product count from DummyJSON is to fetch all products and it's really bad for performence 
    const data: Data = await fetchAdminData()

    return <>
        <div className={styles.dashboard}>
            <div className={styles.card}>
                <h2>Order Overview</h2>
                <p>Total Orders: <span>{data.orderCount}</span></p>
                <p>Total Value: <span>${data.totalOrderPrice.toFixed(2)}</span></p>
                <h3>Order Status Breakdown</h3>
                {data.statusData.map((data, index) => (
                    <p key={index}>{data.status} Orders: <span>{data.statusCount}</span></p>
                ))}
            </div>
            <div className={styles.card}>
                <h2>Product Overview</h2>
                <p>Total products: <span>{productCount}</span></p>
            </div>
            <div className={styles.card}>
                <h2>User Overview</h2>
                <p>Total users: <span>{data.userCount}</span></p>
                <p>Total admin users: <span>{data.adminUserCount}</span></p>
            </div>
        </div>
    </>
}