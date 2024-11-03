"use client"

import styles from '@/styles/modules/SearchBar.module.scss'

type Modal = {
    showModal: boolean
    setShowModal: React.Dispatch<React.SetStateAction<boolean>>
    navigate: () => void
}

export function SearchModal({ showModal, setShowModal, navigate }: Modal ){

    if(!showModal) return null

    return <>
        <div className={styles.backdrop} onClick={() => setShowModal(false)}>
            <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
                <input type="text" placeholder="Search" onClick={(e) => e.stopPropagation()}/>
                <button onClick={() => navigate() }>Search</button>
            </div>
        </div>
    </>
}