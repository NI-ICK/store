"use client"

import Image from "next/image"
import Link from "next/link"
import styles from '@/styles/modules/ProductDetails.module.scss'
import { useEffect, useState } from "react"
import { ArrowIcon } from "@/assets/ArrowIcon"

const gap = 48
const element = 240

export function MoreProducts({ moreProducts, productId }: { moreProducts: Product[], productId: number }) {
    const [ numberOfElements, setNumberOfElements ] = useState(0)
    const [ displayIndex, setDisplayIndex ] = useState(0)

    const handleNumberOfElements = () => {
        setNumberOfElements(Math.floor(window.innerWidth / (element + gap)))
    }

    useEffect(() => {
        handleNumberOfElements()
        window.addEventListener('resize', () => handleNumberOfElements())
        return () => window.removeEventListener('resize', () => handleNumberOfElements())
    }, [])

    const handleProductTitle = (title: string) => {
        return title.length > 25 ? title.substring(0, 22) + '...' : title
    }

    const handleProductPrice = (product: Product) => {
        const discountedPrice = (product.price - (product.price * (product.discountPercentage / 100))).toFixed(2)
        return '$ ' + discountedPrice
    }

    const handlePrev = () => {
        return setDisplayIndex(prevIndex => {
            const newIndex = prevIndex - numberOfElements
            return newIndex < 0 ? Math.max(0, Math.ceil((moreProducts.length - 1) / numberOfElements) - 1) * numberOfElements : newIndex
        })        
    }

    const handleNext = () => {
        return setDisplayIndex(prevIndex => {
            const newIndex = prevIndex + numberOfElements
            return newIndex > moreProducts.length - 1 ? 0 : newIndex
        })
    }

    return <>
        <div className={styles.moreProducts}>
            <h2>More like this</h2>
            <div className={styles.productList} >
                {moreProducts.filter(p => p.id !== productId).slice(displayIndex, displayIndex + numberOfElements).map((p, index) => (
                    <Link href={`/products/${p.id}`} key={index} data-id={p.id} className={styles.similarProduct}>
                        <Image src={p.thumbnail} alt={p.title} width={160} height={160}/>
                        <p>{handleProductTitle(p.title)}</p>
                        <p><span>{'$ ' + p.price}</span><span>{handleProductPrice(p)}</span></p>
                    </Link>
                ))}
            </div>
            {moreProducts.length - 1 > numberOfElements && <div className={styles.buttons}>
                <span tabIndex={0} onClick={() => handlePrev()} onKeyDown={(e) => { if(e.key === "Enter") (e.target as HTMLDivElement).click() }}><ArrowIcon rotate={90}/></span>
                <span tabIndex={0} onClick={() => handleNext()} onKeyDown={(e) => { if(e.key === "Enter") (e.target as HTMLDivElement).click() }}><ArrowIcon rotate={-90}/></span>
            </div>}
        </div>
    </>
}