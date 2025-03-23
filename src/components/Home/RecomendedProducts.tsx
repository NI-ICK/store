"use client"

import Image from "next/image"
import Link from "next/link"
import styles from '@/styles/modules/Home.module.scss'
import { useEffect, useState } from "react"
import { ArrowIcon } from "@/assets/ArrowIcon"

const gap = 48
const element = 240

export function RecomendedProducts({ products }: { products: Product[] }) {
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
            return newIndex < 0 ? Math.max(0, Math.ceil((products.length - 1) / numberOfElements) - 1) * numberOfElements : newIndex
        })        
    }

    const handleNext = () => {
        return setDisplayIndex(prevIndex => {
            const newIndex = prevIndex + numberOfElements
            return newIndex > products.length - 1 ? 0 : newIndex
        })
    }

    return <>
        <div className={styles.recomended}>
            <h2>Recomended</h2>
            <div className={styles.productList} >
                {products.slice(displayIndex, displayIndex + numberOfElements).map((product, index) => (
                    <Link href={`/products/${product.id}`} key={index} data-id={product.id} className={styles.product}>
                        <Image src={product.thumbnail} alt={product.title} width={160} height={160}/>
                        <p>{handleProductTitle(product.title)}</p>
                        <p><span>{'$ ' + product.price}</span><span>{handleProductPrice(product)}</span></p>
                    </Link>
                ))}
            </div>
            {products.length - 1 > numberOfElements && <div className={styles.buttons}>
                <span role='button' tabIndex={0} onClick={() => handlePrev()} onKeyDown={(e) => { if(e.key === "Enter") (e.target as HTMLDivElement).click() }}><ArrowIcon rotate={90}/></span>
                <span role='button' tabIndex={0} onClick={() => handleNext()} onKeyDown={(e) => { if(e.key === "Enter") (e.target as HTMLDivElement).click() }}><ArrowIcon rotate={-90}/></span>
            </div>}
        </div>
    </>
}