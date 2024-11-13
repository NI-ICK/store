"use client"

import { HamburgerIcon } from '@/assets/HamburgetIcon'
import styles from '@/styles/modules/Admin.module.scss'
import { fetchUser } from '@/utils/fetchData'
import Link from 'next/link'
import { redirect, usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function AdminLayout({ children }: { children: React.ReactNode } ) {
    const path = usePathname()
    const [ isMobile, setIsMobile ] = useState(false)
    const [ showModal, setShowModal ] = useState(false)

    const handleMobile = () => { 
        if(window.innerWidth <= 500) return setIsMobile(true)
        setIsMobile(false)
    }

    useEffect(() => {
        handleMobile()
        window.addEventListener('resize', () => { handleMobile() })
        return () => window.removeEventListener('resize', () => { handleMobile() })
    }, [])

    const loadData = async () => {
        const user: User = await fetchUser()
        if(!user || user.isAdmin === 0) redirect('/404')
    }

    useEffect(() => {
        loadData()
    }, [])

    const handlePath = () => {
        if(path === '/admin') return "Dashboard"
        if(path === '/admin/orders') return "Orders"
        if(path === '/admin/products') return "Products"
        if(path === '/admin/users') return "Users"
    }

    return <>
        <div className={styles.background}>
            <div className={styles.container}>
                {isMobile ? <nav className={styles.mobileNav}>
                    <p>{handlePath()}</p>
                    <span onClick={() => setShowModal(true)} className={showModal ? styles.active : ''}><HamburgerIcon />
                    {showModal ? <><div className={styles.backdrop} onPointerDown={() => setShowModal(false)}></div>
                    <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
                        <Link href="/admin" onClick={() => setShowModal(false)}>Dashboard</Link>
                        <Link href="/admin/orders" onClick={() => setShowModal(false)}>Orders</Link>
                        <Link href="/admin/products" onClick={() => setShowModal(false)}>Products</Link>
                        <Link href="/admin/users" onClick={() => setShowModal(false)}>Users</Link>
                    </div>
                    </> : null}
                </span>
                </nav> : <nav className={styles.nav}>
                    <Link href="/admin" className={path === '/admin' ? styles.active : ''}>Dashboard</Link>
                    <Link href="/admin/orders" className={path === '/admin/orders' ? styles.active : ''}>Orders</Link>
                    <Link href="/admin/products" className={path === '/admin/products' ? styles.active : ''}>Products</Link>
                    <Link href="/admin/users" className={path === '/admin/users' ? styles.active : ''}>Users</Link>
                </nav>}
                {children}
            </div>
        </div>
    </>
}