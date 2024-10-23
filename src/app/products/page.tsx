import styles from '@/styles/modules/Products.module.scss'
import Fuse from "fuse.js"
import Link from 'next/link'
import { fetchAllProducts, fetchProductsByCategory, fetchProductsByQuery, fetchCategories } from "@/utils/FetchData"
import { SearchIcon } from "@/assets/SearchIcon"
import { CategoryFilter } from "@/app/products/_components/CategoryFilter"
import { filterProducts } from '../_actions/filterProducts'
import { PriceFilter } from '@/app/products/_components/PriceFilter'
import { XIcon } from '@/assets/XIcon'
import { Buttons } from './_components/Buttons'
import Image from 'next/image'

export default async function Products({ searchParams }: { searchParams: { [key: string]: string | string[] | undefined } }) {
    const query = searchParams.q as string || null
    let qCategory = searchParams.c as string || null
    const price = searchParams.pr as string || null
    const priceFrom = price?.split('-')[0] as string || undefined
    const priceTo = price?.split('-')[1] as string || undefined
    const currentPage = parseInt(searchParams.p as string) || 0
    const categoryList: string[] = await fetchCategories()
    let products: Product[] = []
    let numberOfPages = 0

    const handleProductTitle = (title: string) => {
        return title.length > 30 ? title.substring(0, 27) + '...' : title
    }

    const handleProductPrice = (product: Product) => {
        const discountedPrice = (product.price - (product.price * (product.discountPercentage / 100))).toFixed(2)

        return '$ ' + discountedPrice
    }

    const getProducts = async () => {
        if(qCategory) {
            const category = qCategory[0].toLowerCase() + qCategory.slice(1).replace(/ /g, '-')
            const response = await fetchProductsByCategory(category, currentPage)
            let fetchedProducts: Product[] = []
            if(response) {
                fetchedProducts = response.data.products
                numberOfPages = Math.ceil(response.data.total / 30)
            }
            if(query) {
                const fuse = new Fuse(fetchedProducts, {
                    keys: ['title', 'description', 'tags'],
                    threshold: 0.3
                })
                const result = fuse.search(query)
                fetchedProducts = result.map(resultItem => resultItem.item) 
            }
            return products = fetchedProducts
        }

        if(query) {
            const response = await fetchProductsByQuery(query, currentPage)
            let fetchedProducts: Product[] = []
            if(response) {
                fetchedProducts = response.data.products
                numberOfPages = Math.ceil(response.data.total / 30)
            }
            return products = fetchedProducts
        }

        const response = await fetchAllProducts(currentPage)
        if(response) {
            numberOfPages = Math.ceil(response.data.total / 30)
            return products = response.data.products
        }
        return products = []
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
                        <Image src={product.thumbnail} alt={product.title} draggable={false} width={192} height={192}/>
                        <p>{handleProductTitle(product.title)}</p>
                        <div>
                            <p className={styles.price}>{'$ ' + product.price}</p>
                            <p className={styles.discountedPrice}>{handleProductPrice(product)}</p>
                            <Buttons product={product}/>
                        </div>
                    </Link>
                    )) : <p className={styles.info}>No products found</p>}
                </div>
                <div className={styles.pageButtons}>
                    {Array.from({ length: numberOfPages }, (_, index) => {
                        const isCurrentPage = currentPage === index
                        return <Link key={index} href={`/products?${new URLSearchParams({ ...searchParams, p: index.toString() }).toString()}`} className={isCurrentPage ? styles.active : ''}>{index + 1}</Link>
                    })}
                </div>
            </div>            
        </div>
    </>
}