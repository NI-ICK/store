import styles from '@/styles/modules/NavBar.module.scss'
import { SearchBar } from "./SearchBar"
import { fetchCategories, fetchUser } from '@/utils/fetchData'
import { Links } from './Links'

export async function NavBar() {
    const categories = await fetchCategories()
    let loggedUser: User | null = await fetchUser()

    return <>
        <nav className={styles.navBar}>
            <SearchBar categories={categories} />
            <Links loggedUser={loggedUser}/>    
        </nav>
    </>
}