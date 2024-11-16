import styles from '@/styles/modules/Admin.module.scss'
import { fetchAllProductsByPage } from '@/utils/fetchData'
import Image from 'next/image'
import Link from 'next/link'
import { MobileDetails } from './_components/MobileDetails'

export default async function ProductPage(props: { searchParams: Promise<{ [key: string]: string | string[] | undefined }> }) {
    const searchParams = await props.searchParams
    let currentPage = parseInt(searchParams.p as string) || 1
    let numberOfPages = 0
    let products: Product[] = []

    const loadProducts = async () => {
        const response = await fetchAllProductsByPage(currentPage)
        if(response) {
            numberOfPages = Math.ceil(response.total / 30)
            return products = response.products
        }
    }
    await loadProducts()

    const handleProductPrice = (product: Product) => {
        const discountedPrice = (product.price - (product.price * (product.discountPercentage / 100))).toFixed(2)
        return '$ ' + discountedPrice
    }

    const handleCategoryName = (category: string) => {
        return category[0].toUpperCase() + category.slice(1).replace(/-/g, ' ')
    }

    return <>
        <div className={styles.products}>
            {products.map((product, index) => (
                <div key={index} className={styles.product}>
                    <MobileDetails product={product}/>
                    <Image src={product.thumbnail} alt={product.title} width={112} height={112}/>
                    <div className={styles.wrapper}>
                        <h2>{product.title}</h2>
                        <div className={styles.details}>
                            <p>ID: <span>{product.id}</span></p>
                            <p>Category: <span>{handleCategoryName(product.category)}</span></p>
                            <p>Stock: <span>{product.stock}</span></p>
                            <p>Price: <span>$ {product.price}</span></p>
                            <p>Discounted price: <span>{handleProductPrice(product)} ({product.discountPercentage}%)</span></p>
                            <p>SKU: <span>{product.sku}</span></p>
                            <p>Warranty: <span>{product.warrantyInformation}</span></p>
                            <p>Policy: <span>{product.returnPolicy}</span></p>
                            <p>Shipping: <span>{product.shippingInformation}</span></p>
                        </div>
                    </div>
                </div>
            ))}
        </div>
        <div className={styles.pageButtons}>
            {Array.from({ length: numberOfPages }, (_, index) => {
                const isCurrentPage = currentPage === index + 1
                return <Link key={index + 1} href={`/admin/products?${new URLSearchParams({ ...searchParams, p: (index + 1).toString() }).toString()}`} className={isCurrentPage ? styles.active : ''}>{index + 1}</Link>
            })}
        </div>
    </>
} 