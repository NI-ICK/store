import { RecomendedProducts } from '@/components/Home/RecomendedProducts'
import styles from '@/styles/modules/Home.module.scss'
import { fetchAllProducts } from '@/utils/fetchData'

export default async function Home() {
    const products: Product[] = await fetchAllProducts()
    const recomendedProducts = products.filter(product => {
        const rating = parseFloat((product.reviews.reduce((sum, review) => sum + review.rating, 0) / product.reviews.length).toFixed(2))
        return rating > 4.5
    })
    const highestDiscount = Math.ceil(products.reduce((maxDiscount, product) => Math.max(maxDiscount, product.discountPercentage), 0))

    return <>
        <div className={styles.background}>
            <div className={styles.info}>
                <h1> Biggest Sale of the Season! </h1>
                <p>Get up to <span>{highestDiscount}% OFF</span> on all items. </p>
            </div>
            <RecomendedProducts products={recomendedProducts}/>
        </div>
    </>
}

