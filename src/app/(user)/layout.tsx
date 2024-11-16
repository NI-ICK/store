"use client"

import styles from '@/styles/modules/User.module.scss'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function UserLayout({ children }: { children: React.ReactNode }) {
    const path = usePathname()
    
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