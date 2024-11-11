"use client"

import Link from "next/link"
import styles from '@/styles/modules/NavBar.module.scss'
import { useUserStore } from "@/store/useUserStore"
import { useRouter } from "next/navigation"
import axios from "axios"

type Props = {
    showSettingsModal: boolean
    setShowSettingsModal: React.Dispatch<React.SetStateAction<boolean>>
}

export function SettingsModal({ showSettingsModal, setShowSettingsModal }: Props) {
    const logoutUser = useUserStore(state => state.logoutUser)
    const router = useRouter()

    const handleLogout = () => {
        logoutUser()
        axios.post('/api/logout')
        router.push('/')
    }

    if(!showSettingsModal) return null

    return <>
        <div className={styles.settingsModal} onMouseLeave={() => setShowSettingsModal(false)}>
            <Link href={`/orders`}>Orders</Link>   
            <Link href={`/settings`}>Settings</Link>   
            <p onClick={handleLogout} tabIndex={0} onKeyDown={(e) => { if(e.key === "Enter") (e.target as HTMLDivElement).click() }}>Log out</p> 
        </div>    
    </>
}