import styles from '@/styles/modules/Products.module.scss'

import Fuse from "fuse.js"
import { fetchAllProducts, fetchProductsByCategory, fetchProductsByQuery, fetchCategories } from "@/utils/FetchData"
import { SearchIcon } from "@/assets/SearchIcon"
import { CategoryFilter } from "@/components/Products/CategoryFilter"
import { filterProducts } from '../actions/filterProducts'
import { PriceFilter } from '@/components/Products/PriceFilter'

export default async function Products({ searchParams }: { searchParams: { [key: string]: string | string[] | undefined } }) {
    const query = searchParams.q as string || null
    let qCategory = searchParams.c as string || null
    let products: Product[] = []
    const categoryList: string[] = await fetchCategories()
    
    const getProducts = async () => {
        if(qCategory) {
            let category = qCategory[0].toLowerCase() + qCategory.slice(1).replace(/ /g, '-')
            let request: Product[] = await fetchProductsByCategory(category)
            if(query) {
                const fuse = new Fuse(request, {
                    keys: ['title', 'description', 'tags'],
                    threshold: 0.3
                })
                const result = fuse.search(query)
                request = result.map(resultItem => resultItem.item) 
            }
            return products = request
        }
        if(query) return products = await fetchProductsByQuery(query)
        return products = await fetchAllProducts()
    }
    await getProducts()

    return <>
        <div className={styles.filters}>
            <form action={filterProducts}>
                <div className={styles.header}>
                    <h2>Filters</h2>
                    <button type="submit"><SearchIcon /></button>
                </div>
                <input type="text" name="query" style={{ display: 'none' }} defaultValue={query ? query : undefined}/>
                <PriceFilter />
                <CategoryFilter categoryList={categoryList} qCategory={qCategory}/>
            </form>
        </div>
        <div>
            {products.map((product, index) => (
                <p key={index}>{product.title}</p>
            ))}
        </div>
        <h2>Showing results for: "{query}"</h2>
    </>
}