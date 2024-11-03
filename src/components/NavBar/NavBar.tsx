import styles from '@/styles/modules/NavBar.module.scss'
import { SearchBar } from "./SearchBar"
import { fetchCategories, fetchUser } from '@/utils/FetchData'
import { Links } from './Links'
import { cookies } from 'next/headers'

export async function NavBar() {
    const categories = await fetchCategories()
    const token = (await cookies()).get('token')
    let loggedUser: User | null = null
    if(token) loggedUser = await fetchUser(token.value)

    return <>
        <nav className={styles.navBar}>
            <SearchBar categories={categories} />
            <Links loggedUser={loggedUser}/>    
        </nav>
    </>
}