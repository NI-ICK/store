"use client"

import styles from '@/styles/modules/SearchBar.module.scss'
import { SearchIcon } from "@/assets/SearchIcon"
import { useState } from "react"
import { useRouter } from 'next/navigation'
import { SearchModal } from './SearchModal'
import { ArrowIcon } from '@/assets/ArrowIcon'

export function SearchBar({ categories }: { categories: string[] }) {
    const [ showCategories, setShowCategories ] = useState(false)
    const [ selectedCategory, setSelectedCategory ] = useState('Category')
    const [ showModal, setShowModal ] = useState(false)
    const [ query, setQuery ] = useState('')
    const router = useRouter()

    const handleCategoryName = (category: string) => {
        return category[0].toUpperCase() + category.slice(1).replace(/-/g, ' ')
    }

    const navigate = () => {
        const queryParams: string[] = []
        if(query) queryParams.push(`q=${encodeURIComponent(query)}`)
        if(selectedCategory !== 'Category') queryParams.push(`c=${encodeURIComponent(selectedCategory)}`)
        
        const searchParams = queryParams.length ? '?' + queryParams.join('&') : ''
        router.push(`/products${searchParams}`)
    }

    return <>
        <SearchModal showModal={showModal} setShowModal={setShowModal} navigate={navigate} />
        <div className={styles.searchBar}> 
            <input type="text" placeholder="Search" value={query} onChange={(e) => setQuery(e.target.value)} onKeyDown={(e) => { if(e.key === "Enter") navigate() }}/>
            <div className={styles.dropdownBtn} onClick={() => setShowCategories(!showCategories)} tabIndex={0} onKeyDown={(e) => { if(e.key === "Enter") (e.target as HTMLDivElement).click() }}>
                <p>{handleCategoryName(selectedCategory)}</p><span><ArrowIcon /></span>
            </div>
            <div style={{ display: showCategories ? 'block' : 'none' }} onMouseLeave={() => setShowCategories(false)} className={styles.dropdownMenu}>
                <div className={styles.content} >
                    {categories && categories.map((category, index) => (
                        <p key={index} onClick={() => setSelectedCategory(category)} tabIndex={0} onKeyDown={(e) => { if(e.key === "Enter") (e.target as HTMLDivElement).click() }}>{handleCategoryName(category)}</p>
                    ))}
                </div>
            </div>
            <span onClick={ () => { navigate() }} tabIndex={0} className={styles.searchIcon} onKeyDown={(e) => { if(e.key === "Enter") (e.target as HTMLDivElement).click() }}>
                <SearchIcon />
            </span>
        </div>
        <span tabIndex={0} onClick={() => setShowModal(true)}>
            <SearchIcon />
        </span>
    </>
}