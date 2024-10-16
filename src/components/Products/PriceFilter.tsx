"use client"

import styles from '@/styles/modules/Products.module.scss'
import { useState } from 'react'

export function PriceFilter() {
    const [ priceFrom, setPriceFrom ] = useState<string>('')
    const [ priceTo, setPriceTo ] = useState<string>('')

    const handlePriceFrom = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value
        if(value === "") return setPriceFrom('')
        if(Number(value) > 9999) return
        setPriceFrom(value)
    }

    const handlePriceTo = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value
        if(value === "") return setPriceTo('')
        if(Number(value) > 9999) return
        setPriceTo(value)
    }

    return <>
        <div className={styles.price}>
            <p>Price</p>
            <div>
                <label htmlFor="priceFrom">
                    <input type="number" name="priceFrom" id="priceFrom" step=".01" value={priceFrom} onChange={handlePriceFrom}/>
                </label>
                -
                <label htmlFor="priceTo">
                    <input type="number" name="priceTo" id="priceTo" step=".01" value={priceTo} onChange={handlePriceTo}/>
                </label>
            </div>
        </div>
    </>
}