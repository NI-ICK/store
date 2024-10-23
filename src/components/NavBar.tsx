import styles from '@/styles/modules/NavBar.module.scss'
import { SearchBar } from "./SearchBar"
import { fetchCategories } from '@/utils/FetchData'
import { CartIcon } from "@/assets/CartIcon"
import { ProfileIcon } from "@/assets/ProfileIcon"
import { WishlistIcon } from "@/assets/WishlistIcon"
import Link from 'next/link'

export async function NavBar() {
    const categories = await fetchCategories()

    return <>
        <nav className={styles.navBar}>
            <SearchBar categories={categories} />
            <div className={styles.links}>
                <Link href="/cart">
                    <span>
                        <CartIcon />
                    </span>
                    <p>Cart</p>
                </Link>
                <Link href="/wishlist">
                    <span>
                        <WishlistIcon />
                    </span>
                    <p>Wishlist</p>
                </Link>
                <Link href="/profile">
                    <span>
                        <ProfileIcon />
                    </span> 
                    <p>Profile</p>
                </Link>
            </div>
        </nav>
    </>
}