"use client"

import { useEffect, useState } from "react"
import { LoginModal } from "./LoginModal"
import { RegisterModal } from "./RegisterModal"
import Link from "next/link"
import { UserIcon } from "@/assets/UserIcon"
import styles from '@/styles/modules/NavBar.module.scss'
import { WishlistIcon } from "@/assets/WishlistIcon"
import { CartIcon } from "@/assets/CartIcon"
import { SettingsModal } from "./SettingsModal"
import { Popup } from "../Popup"
import { AdminIcon } from "@/assets/AdminIcon"
import { usePathname } from "next/navigation"
import { HomeIcon } from "@/assets/HomeIcon"
import { useUserStore } from "@/store/useUserStore"
import { useWishlistStore } from "@/store/useWishlistStore"
import { useCartStore } from "@/store/useCartStore"

export function Links() {
    const [ showLoginModal, setShowLoginModal ] = useState(false)
    const [ showRegisterModal, setShowRegisterModal ] = useState(false)
    const [ showSettingsModal, setShowSettingsModal ] = useState(false)
    const [ isMobile, setIsMobile ] = useState(false)
    const user = useUserStore(state => state.user)
    const setUser = useUserStore(state => state.setUser)
    const setUserIdW = useWishlistStore(state => state.setUserId)
    const getWishlistItems = useWishlistStore(state => state.getWishlistItems)
    const setUserIdC = useCartStore(state => state.setUserId)
    const getCartItems = useCartStore(state => state.getCartItems)
    const path = usePathname()

    const handleMobile = () => {
        if(window.innerWidth <= 500) return setIsMobile(true)
        setIsMobile(false)
    }

    const handleStore = async () => {
        await setUser() 
        await setUserIdW()
        await getWishlistItems()
        await setUserIdC()
        await getCartItems()
    }

    useEffect(() => {
        handleStore()
        handleMobile()
        window.addEventListener('resize', () => { handleMobile() })
        return () => window.removeEventListener('resize', () => { handleMobile() })
    }, [])

    const handleUserName = (name: string) => {
        return name.length > 10 ? name.substring(0, 7) + '...' : name
    }

    return <>
        <div className={styles.links}>
            <LoginModal showLoginModal={showLoginModal} setShowLoginModal={setShowLoginModal} setShowRegisterModal={setShowRegisterModal}/>
            <RegisterModal showRegisterModal={showRegisterModal} setShowRegisterModal={setShowRegisterModal}/>
            <Link href="/" className={`${styles.link} ${styles.home} ${path === '/' ? styles.active : ''}`}>
                <span>
                    <HomeIcon />
                </span>
                <p>Home</p>
            </Link>
            {user ? <>
            <Link href="/cart" className={`${styles.link} ${styles.fill} ${path === '/cart' ? styles.active : ''}`}>
                <span>
                    <CartIcon />
                </span>
                <p>Cart</p>
            </Link>
            <Link href="/wishlist" className={`${styles.link} ${styles.fill} ${path === '/wishlist' ? styles.active : ''}`}>
                <span>
                    <WishlistIcon />
                </span>
                <p>Wishlist</p>
            </Link>
            <div className={`${styles.link} ${styles.stroke} ${path === '/orders' || path === '/settings' ? styles.active : ''}`} onClick={() => setShowSettingsModal(!showSettingsModal)} tabIndex={0} onKeyDown={(e) => { if(e.key === "Enter") (e.target as HTMLDivElement).click() }}>
                <span>
                    <UserIcon />
                </span> 
                <p>{handleUserName(user.name)}</p>
                <SettingsModal showSettingsModal={showSettingsModal} setShowSettingsModal={setShowSettingsModal} isMobile={isMobile} isAdmin={user.isAdmin}/>
            </div>
            {user.isAdmin && !isMobile ?
            <Link href="/admin" className={`${styles.link} ${styles.stroke} ${path.startsWith('/admin') ? styles.active : ''}`}>
                <span>
                    <AdminIcon />
                </span>
                <p>Dashboard</p>
            </Link> : null}
            </> : <>
            <div className={`${styles.link} ${styles.fill}`} onClick={() => setShowLoginModal(true)} tabIndex={0} onKeyDown={(e) => { if(e.key === "Enter") (e.target as HTMLDivElement).click()}}>
                <span>
                    <CartIcon />
                </span> 
                <p>Cart</p>
            </div>
            <div className={`${styles.link} ${styles.fill}`} onClick={() => setShowLoginModal(true)} tabIndex={0} onKeyDown={(e) => { if(e.key === "Enter") (e.target as HTMLDivElement).click()}}>
                <span>
                    <WishlistIcon />
                </span> 
                <p>Wishlist</p>
            </div>
            <div className={`${styles.link} ${styles.stroke}`} onClick={() => setShowLoginModal(true)} tabIndex={0} onKeyDown={(e) => { if(e.key === "Enter") (e.target as HTMLDivElement).click()}}>
                <span>
                    <UserIcon />
                </span> 
                <p>Login</p>
            </div>
            </>}
        </div>
        <Popup />
    </>
}