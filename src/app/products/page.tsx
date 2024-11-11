import styles from '@/styles/modules/Products.module.scss'
import Fuse from "fuse.js"
import Link from 'next/link'
import { fetchAllProducts, fetchProductsByCategory, fetchProductsByQuery, fetchCategories } from "@/utils/fetchData"
import { SearchIcon } from "@/assets/SearchIcon"
import { CategoryFilter } from "@/app/products/_components/CategoryFilter"
import { filterProducts } from '../_actions/filterProducts'
import { PriceFilter } from '@/app/products/_components/PriceFilter'
import { XIcon } from '@/assets/XIcon'
import { Buttons } from './_components/Buttons'
import Image from 'next/image'

export default async function Products(props: { searchParams: Promise<{ [key: string]: string | string[] | undefined }> }) {
    const searchParams = await props.searchParams
    const query = searchParams.q as string 
    let category = searchParams.c as string 
    const price = searchParams.pr as string 
    const priceFrom = price?.split('-')[0] as string 
    const priceTo = price?.split('-')[1] as string 
    const currentPage = parseInt(searchParams.p as string) || 1
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
        if(category) {
            let { products: fetchedProducts, total }: { products: Product[], total: number } = await fetchProductsByCategory(category, currentPage)

            numberOfPages = Math.ceil(total / 30)

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
                fetchedProducts = response.products
                numberOfPages = Math.ceil(response.total / 30)
            }
            return products = fetchedProducts
        }

        const response = await fetchAllProducts(currentPage)
        if(response) {
            numberOfPages = Math.ceil(response.total / 30)
            return products = response.products
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
                    <PriceFilter />
                    <CategoryFilter categoryList={categoryList} />
                </form>
            </div>
            <div className={styles.container}>
                {query && <div className={styles.qResult}>
                    <h2>Showing results for: "{query}"</h2>
                    <Link href="/products"><XIcon /></Link>
                </div>}
                <div className={styles.products}>
                    {products ? products
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
                {numberOfPages > 1 && <div className={styles.pageButtons}>
                    {Array.from({ length: numberOfPages }, (_, index) => {
                        const isCurrentPage = currentPage === index + 1
                        return <Link key={index + 1} href={`/products?${new URLSearchParams({ ...searchParams, p: (index + 1).toString() }).toString()}`} className={isCurrentPage ? styles.active : ''}>{index + 1}</Link>
                    })}
                </div>}
            </div>            
        </div>
    </>
}