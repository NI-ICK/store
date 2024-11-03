"use client"

import { useState } from "react"
import styles from '@/styles/modules/Products.module.scss'
import { useSearchParams } from "next/navigation"

export function CategoryFilter({ categoryList }: { categoryList: string[] }) {
    const params = useSearchParams()
    const category = params.get('c')
    const [ selectedCategory, setSelectedCategory ] = useState(category)

    const handleCategoryName = (category: string) => {
        return category[0].toUpperCase() + category.slice(1).replace(/-/g, ' ')
    }

    return <>
        <div className={styles.categoriesFilter}>
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
                            setSelectedCategory(category)
                    }}}>
                    <input type="radio" id={category} name="category" value={category} checked={selectedCategory === category} onChange={() => setSelectedCategory(category)}/>
                    <span className={`${styles.customRadio} ${selectedCategory === category ? styles.selected : ''}`}></span>
                    {handleCategoryName(category)}
                </label>
            ))}
                        
        </div>
    </>
}