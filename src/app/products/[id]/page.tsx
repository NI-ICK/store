import styles from '@/styles/modules/ProductDetails.module.scss'
import { fetchProductsByCategory, fetchSingleProduct } from '@/utils/FetchData'
import { StarIcon } from '@/assets/StarIcon'
import Link from 'next/link'
import { ImageSlider } from '@/app/products/[id]/_components/ImageSlider'
import { Buttons } from './_components/Buttons'
import Image from 'next/image'
import { MoreProducts } from './_components/MoreProducts'
import { notFound } from 'next/navigation'

export default async function Product(props: { params: Promise<{ id: number }>}) {
    const params = await props.params;

    const product: Product | undefined = await fetchSingleProduct(params.id)
    if(!product) notFound()

    const rating = parseFloat((product.reviews.reduce((sum, review) => sum + review.rating, 0) / product.reviews.length).toFixed(2))
    const moreProducts: Product[] = await fetchProductsByCategory(product.category)

    const handleProductPrice = (product: Product) => {
        const discountedPrice = (product.price - (product.price * (product.discountPercentage / 100))).toFixed(2)
        return '$ ' + discountedPrice
    }

    const handleAvgRating = () => {
        const fullStars = Math.floor(rating)
        const hasHalfStar = rating % 1 >= 0.5
        
        const stars = []

        for(let i = 0; i < fullStars; i++) stars.push(<StarIcon className='fullStar' key={`full-${i}`}/>)
        if(hasHalfStar) stars.push(<StarIcon className='halfStar' key='half'/>)

        return <span>{stars}</span>
    }

    const handleReviewRating = (rating: number) => {
        const fullStars = Math.floor(rating)
        const hasHalfStar = rating % 1 >= 0.5

        const stars = []

        for(let i = 0; i < fullStars; i++) stars.push(<StarIcon className='fullStar' key={`full-${i}`}/>)
        if(hasHalfStar) stars.push(<StarIcon className='halfStar' key='hlaf'/>)

        return <span>{stars}</span>
    }

    return <>
        <div className={styles.mainContainer}>
            <div className={styles.product}>
                <div className={styles.container}>
                  <ImageSlider product={product}/>
                    <div className={styles.productDetails}> 
                        <h2>{product.title}</h2>
                        <div className={styles.rating}>
                            {handleAvgRating()}
                            <Link href="#reviews">{rating} ({product.reviews.length})</Link>
                        </div>
                        <p className={styles.description}>{product.description}</p>
                        <ul>
                            {product.brand && <li>Brand: <span>{product.brand}</span></li>}
                            <li>Warranty: <span>{product.warrantyInformation}</span></li>
                            <li>Shipping: <span>{product.shippingInformation}</span></li>
                            <li>Return policy: <span>{product.returnPolicy}</span></li>
                        </ul>
                        <div className={styles.priceDetails}>
                            <p className={styles.price}>{'$ ' + product.price}</p>
                            <p className={styles.discountedPrice}>{handleProductPrice(product)}</p>
                        </div>
                        <Buttons product={product}/>
                    </div>
                </div>
            </div>

            <MoreProducts moreProducts={moreProducts} productId={product.id} />

            <div className={styles.reviews} id='reviews'>
                <h2>Reviews</h2>
                {product.reviews.map((review, index) => (
                    <div className={styles.review} key={index}>
                        <Image src="/profileImg.webp" alt={review.reviewerName} width={40} height={40}/>
                        <div className={styles.content}>
                            <p>{review.reviewerName}</p>
                            {handleReviewRating(review.rating)}
                            <p>{review.comment}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    </>
}