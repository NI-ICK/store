"use client"

import styles from '@/styles/modules/Admin.module.scss'
import { useState } from 'react'

export function MobileDetails({ product }: { product: Product }) {
    const [ showModal, setShowModal ] = useState(false)
    
    const handleProductPrice = (product: Product) => {
        const discountedPrice = (product.price - (product.price * (product.discountPercentage / 100))).toFixed(2)
        return '$ ' + discountedPrice
    }

    const handleCategoryName = (category: string) => {
        return category[0].toUpperCase() + category.slice(1).replace(/-/g, ' ')
    }
    
    return <>
        <div className={styles.mobileActive} onClick={() => setShowModal(true)}>
            {showModal ? <div className={styles.productBackdrop} onClick={(e) => { setShowModal(false), e.stopPropagation() }}>
                <div className={styles.productModal} onClick={(e) => e.stopPropagation()}>
                    <h2>{product.title}</h2>
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
            </div>: null}
        </div>
    </>
}