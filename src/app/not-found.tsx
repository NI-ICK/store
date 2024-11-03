import Link from "next/link"
import styles from '@/styles/modules/Misc.module.scss'

export default function NotFound() {

    return <>
        <div className={styles.background}>
            <div className={styles.notFound}>
                <h2>404</h2>
                <p>Page not found</p>
                <Link href="/">Home</Link>
            </div>
        </div>
    </>
}