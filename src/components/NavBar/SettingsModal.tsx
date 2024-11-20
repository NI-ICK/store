"use client"

import Link from "next/link"
import styles from '@/styles/modules/NavBar.module.scss'
import { useRouter } from "next/navigation"
import axios from "axios"
import { useUserStore } from "@/store/useUserStore"

type Props = {
    showSettingsModal: boolean
    setShowSettingsModal: React.Dispatch<React.SetStateAction<boolean>>
    isMobile: boolean
    isAdmin: number
}

export function SettingsModal({ showSettingsModal, setShowSettingsModal, isMobile, isAdmin }: Props) {
    const router = useRouter()
    const logoutUser = useUserStore(state => state.logoutUser)

    const handleLogout = () => {
        logoutUser()
        axios.post('/api/logout')
        router.push('/')
    }

    if(!showSettingsModal) return null

    return <>
        <div className={`${styles.settingsModal} ${isMobile ? styles.mobile : ''}`} onMouseLeave={() => setShowSettingsModal(false)}>
            <Link href={`/orders`}>Orders</Link>   
            <Link href={`/settings`}>Settings</Link>   
            {isMobile && isAdmin ? <Link href={`/admin`}>Admin</Link> : null}
            <p onClick={handleLogout} tabIndex={0} onKeyDown={(e) => { if(e.key === "Enter") (e.target as HTMLDivElement).click() }}>Log out</p> 
        </div>    
    </>
}