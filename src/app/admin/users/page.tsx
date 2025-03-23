import { fetchUserData } from "@/utils/fetchData"
import styles from '@/styles/modules/Admin.module.scss'
import { cookies } from "next/headers"

type UserData = User & { userOrders: number }

export default async function UserPage() {
    const userData: UserData[] = await fetchUserData() || []

    cookies()
    return <>
        <div className={styles.users}>
            {userData.map((user, index) => (
                <div key={index} className={styles.user}>
                    {user.isAdmin ? <p className={styles.admin}>Admin</p> : ''}
                    <p>ID: <span>{user.id}</span></p>
                    <p>Email: <span>{user.email}</span></p>
                    <p>Name: <span>{user.name}</span></p>
                    <p>Orders total: <span>{user.userOrders}</span></p>
                </div>
            ))}
        </div>
    </>
} 