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

    const navigate = () => {
        const queryParams: string[] = []
        if(query) queryParams.push(`q=${encodeURIComponent(query)}`)
        if(selectedCategory !== 'Category') queryParams.push(`c=${encodeURIComponent(selectedCategory)}`)
        
        const searchParams = queryParams.length ? '?' + queryParams.join('&') : ''
        router.push(`/products${searchParams}`)
    }

    return <>
        <SearchModal showModal={showModal} setShowModal={setShowModal}  navigate={navigate} />
        <div className={styles.searchBar}> 
            <input type="text" placeholder="Search" value={query} onChange={(e) => setQuery(e.target.value)} onKeyDown={(e) => { if(e.key === "Enter") navigate() }}/>
            <div className={styles.dropdownBtn} onClick={() => setShowCategories(!showCategories)} tabIndex={0}>
                <p>{selectedCategory}</p><span><ArrowIcon /></span>
            </div>
            <div className={styles.dropdownMenu} style={{ display: showCategories ? 'block' : 'none' }} onMouseLeave={() => setShowCategories(false)}>
                {categories && categories.map((category, index) => (
                    <p key={index} onClick={() => setSelectedCategory(category)}>{category}</p>
                ))}
            </div>
            <span onClick={ () => { navigate() }} tabIndex={0} className={styles.searchIcon} >
                <SearchIcon />
            </span>
        </div>
        <span tabIndex={0} onClick={() => setShowModal(true)}>
            <SearchIcon />
        </span>
    </>
}