"use client"

import { useUserStore } from '@/store/useUserStore'
import styles from '@/styles/modules/User.module.scss'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function UserLayout({ children }: { children: React.ReactNode }) {
    const path = usePathname()
    const user = useUserStore(state => state.user)
    const loading = useUserStore(state => state.loading)
    const router = useRouter()

    useEffect(() => {
        if(!user && !loading) router.push('/')
    }, [user, loading])
    
    return <>
        {(path === '/orders' || path === '/settings') ? <div className={styles.background}>
            <div className={styles.container}>
                <nav className={styles.nav}>
                    <Link href="/orders" className={path === '/orders' ? styles.active : ''}>Orders</Link>
                    <Link href="/settings" className={path === '/settings' ? styles.active : ''}>Settings</Link>
                </nav>
                {children}
            </div>
        </div> : 
        children}
    </>
}