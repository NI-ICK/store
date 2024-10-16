"use client"

import { useState } from "react"
import styles from '@/styles/modules/Products.module.scss'

export function CategoryFilter({ categoryList, qCategory }: { categoryList: string[], qCategory: string | null }) {
    const [ selectedCategory, setSelectedCategory ] = useState(qCategory)

    return <>
        <div className={styles.categories}>
            <p>Categories</p>
            {categoryList && categoryList.map((category, index) => (
                <label 
                    key={index} 
                    htmlFor={category} 
                    tabIndex={0} 
                    onKeyDown={(e) => { 
                        if(e.key === "Enter") {
                            const input = document.getElementById(category) as HTMLInputElement
                            input.checked = true
                    }}}>
                    <input type="radio" id={category} name={category} tabIndex={-1} checked={selectedCategory === category} onChange={() => setSelectedCategory(category) }/>
                    {category}
                </label>
            ))}
                        
        </div>
    </>
}