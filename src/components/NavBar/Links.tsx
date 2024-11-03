"use client"

import { useEffect, useState } from "react"
import { LoginModal } from "./LoginModal"
import { RegisterModal } from "./RegisterModal"
import Link from "next/link"
import { UserIcon } from "@/assets/UserIcon"
import styles from '@/styles/modules/NavBar.module.scss'
import { useUserStore } from "@/store/useUserStore"
import { WishlistIcon } from "@/assets/WishlistIcon"
import { CartIcon } from "@/assets/CartIcon"
import { SettingsModal } from "./SettingsModal"
import { Popup } from "../Popup"

export function Links({ loggedUser }: { loggedUser: User | null }) {
    const [ showLoginModal ,setShowLoginModal ] = useState(false)
    const [ showRegisterModal, setShowRegisterModal ] = useState(false)
    const [ showSettingsModal, setShowSettingsModal ] = useState(false)
    const user = useUserStore(state => state.user)
    const setUser = useUserStore(state => state.setUser)
    const setLoading = useUserStore(state => state.setLoading)

    useEffect(() => {
        if(loggedUser) setUser(loggedUser), setLoading(false)
        if(!loggedUser) setLoading(false)
    }, [loggedUser])

    return <>
        <div className={styles.links}>
            <LoginModal showLoginModal={showLoginModal} setShowLoginModal={setShowLoginModal} setShowRegisterModal={setShowRegisterModal}/>
            <RegisterModal showRegisterModal={showRegisterModal} setShowRegisterModal={setShowRegisterModal}/>
            {user ? <>
            <Link href="/cart" className={styles.link}>
                <span>
                    <CartIcon />
                </span>
                <p>Cart</p>
            </Link>
            <Link href="/wishlist" className={styles.link}>
                <span>
                    <WishlistIcon />
                </span>
                <p>Wishlist</p>
            </Link>
            <div className={styles.link} onClick={() => setShowSettingsModal(!showSettingsModal)} tabIndex={0} onKeyDown={(e) => { if(e.key === "Enter") (e.target as HTMLDivElement).click() }}>
                <span>
                    <UserIcon />
                </span> 
                <p>{user.name}</p>
                <SettingsModal showSettingsModal={showSettingsModal} setShowSettingsModal={setShowSettingsModal}/>
            </div>
            </> : <>
            <div className={styles.link} onClick={() => setShowLoginModal(true)} tabIndex={0} onKeyDown={(e) => { if(e.key === "Enter") (e.target as HTMLDivElement).click()}}>
                <span>
                    <CartIcon />
                </span> 
                <p>Cart</p>
            </div>
            <div className={styles.link} onClick={() => setShowLoginModal(true)} tabIndex={0} onKeyDown={(e) => { if(e.key === "Enter") (e.target as HTMLDivElement).click()}}>
                <span>
                    <WishlistIcon />
                </span> 
                <p>Wishlist</p>
            </div>
            <div className={styles.link} onClick={() => setShowLoginModal(true)} tabIndex={0} onKeyDown={(e) => { if(e.key === "Enter") (e.target as HTMLDivElement).click()}}>
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