import styles from '@/styles/modules/Products.module.scss'
import Fuse from "fuse.js"
import Link from 'next/link'
import { fetchAllProductsByPage, fetchProductsByCategory, fetchProductsByQuery, fetchCategories } from "@/utils/fetchData"
import { Buttons } from './_components/Buttons'
import Image from 'next/image'
import { Filters } from './_components/Filters'
import { SearchedQuery } from './_components/SearchedQuery'

export default async function Products(props: { searchParams: Promise<{ [key: string]: string | string[] | undefined }> }) {
    const searchParams = await props.searchParams
    const query = searchParams.q as string 
    const category = searchParams.c as string 
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
            const data: { products: Product[], total: number } = await fetchProductsByCategory(category, currentPage)

            numberOfPages = Math.ceil(data.total / 30)

            if(query) {
                const fuse = new Fuse(data.products, {
                    keys: ['title', 'description', 'tags'],
                    threshold: 0.3
                })
                const result = fuse.search(query)
                data.products = result.map(resultItem => resultItem.item) 
            }
            return products = data.products
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

        const response = await fetchAllProductsByPage(currentPage)
        if(response) {
            numberOfPages = Math.ceil(response.total / 30)
            return products = response.products
        }
        return products = []
    }
    await getProducts()
    
    const filteredProducts = products.filter(product => {
        if(!priceFrom || !priceTo) return product
        return (product.price <= Number(priceTo)) && (product.price >= Number(priceFrom))
    })

    return <>
        <div className={styles.mainContainer}>
            <Filters categoryList={categoryList} query={query}/>
            <div className={styles.container}>
                <SearchedQuery query={query}/>
                <div className={styles.products}>
                    {filteredProducts.length > 0 ? (filteredProducts
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
                    ))) : <p className={styles.info}>No products found</p>}
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