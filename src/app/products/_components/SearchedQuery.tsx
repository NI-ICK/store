"use client"

import { XIcon } from "@/assets/XIcon"
import Link from "next/link"
import styles from '@/styles/modules/Products.module.scss'

export function SearchedQuery({ query }: { query: string }) {

    return <>
        {query && <div className={styles.qResult}>
            <h2>Showing results for: &quot;{query}&quot;</h2>
            <Link href="/products" onClick={() => query = ''}><XIcon /></Link>
        </div>}
    </>
}