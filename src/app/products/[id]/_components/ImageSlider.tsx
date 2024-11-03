"use client"

import styles from '@/styles/modules/ProductDetails.module.scss'
import { ArrowIcon } from "@/assets/ArrowIcon"
import { useState } from 'react'
import Image from 'next/image'

export function ImageSlider({ product }: { product: Product }) {
    const [ imageIndex, setImageIndex ] = useState(0)

    const handleNextImage = () => {
        setImageIndex(prevIndex => {
            if(prevIndex === product.images.length - 1) return 0
            return prevIndex + 1
        })
                
    }

    const handlePrevImage = () => {
        setImageIndex(prevIndex => {
            if(prevIndex === 0) return product.images.length - 1
            return prevIndex - 1
        })
    }

    return <>
          <div className={styles.images}>
            {product.images.map((image, index) => (
                <div key={index} className={styles.imgWrapper} style={{
                    transform: `translateX(${-100 * imageIndex}%)`,
                    opacity: index === imageIndex ? 1 : 0
                }}>
                    <Image 
                        src={image} 
                        alt={product.title} 
                        key={index} 
                        draggable={false} 
                        width={480} 
                        height={480} 
                        quality={80}
                        unoptimized
                        />
                </div>
            ))}
            <button className={styles.prev} style={{ display: product.images.length > 1 ? 'flex' : 'none'}} onClick={() => handlePrevImage()}><ArrowIcon rotate={90}/></button>
            <button className={styles.next} style={{ display: product.images.length > 1 ? 'flex' : 'none'}} onClick={() => handleNextImage()}><ArrowIcon rotate={-90}/></button>
            <div className={styles.indexButtons}>
                {product.images.map((_, index) => (
                    <span 
                        key={index}
                        onClick={() => setImageIndex(index)}
                        style={{ backgroundColor: imageIndex === index ? '#0295db' : ''}}
                    ></span>
                ))}
            </div>
            </div>
    </>
}