"use client"

import styles from '@/styles/modules/Products.module.scss'
import { useSearchParams } from 'next/navigation'
import { useState } from 'react'

export function PriceFilter() {
    const params = useSearchParams()
    const price = params.get('pr') || ''
    const qPriceFrom = price?.split('-')[0] as string 
    const qPriceTo = price?.split('-')[1] as string
    const [ priceFrom, setPriceFrom ] = useState<string>(qPriceFrom ? qPriceFrom : '')
    const [ priceTo, setPriceTo ] = useState<string>(qPriceTo ? qPriceTo : '')

    const handlePriceFrom = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value
        if(value === "") return setPriceFrom('')
        if(Number(value) > 99999) return
        setPriceFrom(value)
    }

    const handlePriceTo = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value
        if(value === "") return setPriceTo('')
        if(Number(value) > 99999) return
        setPriceTo(value)
    }

    return <>
        <div className={styles.priceFilter}>
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