"use clinet"

import { useMainStore } from '@/store/useMainStore'
import styles from '@/styles/modules/Misc.module.scss'

export function Popup() {
    const popupMessage = useMainStore(state => state.popupMessage)
    const showPopup = useMainStore(state => state.showPopup)

    if(!showPopup) return null

    return <>
        <div className={styles.popup}>
            <p>{popupMessage}</p>
        </div>
    </>
}