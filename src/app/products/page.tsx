import styles from '@/styles/modules/Products.module.scss'
import Fuse from "fuse.js"
import Link from 'next/link'
import { fetchAllProducts, fetchProductsByCategory, fetchProductsByQuery, fetchCategories } from "@/utils/FetchData"
import { SearchIcon } from "@/assets/SearchIcon"
import { CategoryFilter } from "@/components/Products/CategoryFilter"
import { filterProducts } from '../_actions/filterProducts'
import { PriceFilter } from '@/components/Products/PriceFilter'
import { XIcon } from '@/assets/XIcon'
import { ProductListButtons } from '@/components/Products/ProductListButtons'

export default async function Products({ searchParams }: { searchParams: { [key: string]: string | string[] | undefined } }) {
    const query = searchParams.q as string || null
    let qCategory = searchParams.c as string || null
    const price = searchParams.p as string || null
    const priceFrom = price?.split('-')[0] as string || undefined
    const priceTo = price?.split('-')[1] as string || undefined
    const categoryList: string[] = await fetchCategories()
    let products: Product[] = []
    
    const handleProductTitle = (title: string) => {
        return title.length > 30 ? title.substring(0, 27) + '...' : title
    }

    const handleProductPrice = (product: Product) => {
        const discountedPrice = (product.price - (product.price * (product.discountPercentage / 100))).toFixed(2)

        return '$ ' + discountedPrice
    }

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
        <div className={styles.mainContainer}>
            <div className={styles.filters}>
                <form action={filterProducts}>
                    <div className={styles.header}>
                        <h2>Filters</h2>
                        <button type="submit"><SearchIcon /></button>
                    </div>
                    <input type="text" name="query" style={{ display: 'none' }} defaultValue={query ? query : undefined}/>
                    <PriceFilter qPriceFrom={priceFrom} qPriceTo={priceTo}/>
                    <CategoryFilter categoryList={categoryList} qCategory={qCategory}/>
                </form>
            </div>
            <div className={styles.container}>
                {query && <div className={styles.qResult}>
                    <h2>Showing results for: "{query}"</h2>
                    <Link href="/products"><XIcon /></Link>
                </div>}
                <div className={styles.products}>
                    {products.length > 0 ? products
                        .filter(product => {
                            if(!priceFrom || !priceTo) return product
                            return (product.price <= Number(priceTo)) && (product.price >= Number(priceFrom))
                        })
                        .map((product, index) => (
                    <Link key={index} className={styles.product} href={`/products/${product.id}`}>
                        <img src={product.thumbnail} alt={product.title} loading='lazy' draggable={false}/>
                        <p>{handleProductTitle(product.title)}</p>
                        <div>
                            <p className={styles.price}>{'$ ' + product.price}</p>
                            <p className={styles.discountedPrice}>{handleProductPrice(product)}</p>
                            <ProductListButtons />
                        </div>
                    </Link>
                    )) : <p className={styles.info}>No products found</p>}
                </div> 
            </div>            
        </div>
    </>
}