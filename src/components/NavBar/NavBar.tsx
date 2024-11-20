import styles from '@/styles/modules/NavBar.module.scss'
import { SearchBar } from "./SearchBar"
import { fetchCategories } from '@/utils/fetchData'
import { Links } from './Links'

export async function NavBar() {
    const categories = await fetchCategories()

    return <>
        <nav className={styles.navBar}>
            <SearchBar categories={categories} />
            <Links />    
        </nav>
    </>
}