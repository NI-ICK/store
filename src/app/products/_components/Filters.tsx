"use client"

import { SearchIcon } from "@/assets/SearchIcon"
import { CategoryFilter } from "./CategoryFilter"
import { PriceFilter } from "./PriceFilter"
import { ArrowIcon } from "@/assets/ArrowIcon"
import styles from '@/styles/modules/Products.module.scss'
import { filterProducts } from "@/app/_actions/filterProducts"
import { useState } from "react"

export function Filters({ categoryList, query }: { categoryList: string[], query: string }) {
    const [ hideFiter, setHideFilter ] = useState(false)

    return <>
        <div className={`${styles.filters} ${hideFiter ? styles.hide : ''}`}>
            <form action={filterProducts}>
                <div className={styles.header}>
                    <h2>Filters</h2>
                    <button type="submit"><SearchIcon /></button>
                    <span onClick={() => setHideFilter(!hideFiter)}><ArrowIcon rotate={180}/></span>
                </div>
                <input type="text" name="query" style={{ display: 'none' }} defaultValue={query ? query : undefined}/>
                <div className={styles.mainFilters}>
                    <PriceFilter />
                    <CategoryFilter categoryList={categoryList} />
                </div>
            </form>
        </div>
    </>
}