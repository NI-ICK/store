"use server"

import { redirect } from "next/navigation"

export async function filterProducts( formData: FormData ) {
    let category = Array.from(formData.entries()).find(([key, value]) => value === 'on')?.[0]
    if(category) category = category[0].toLowerCase() + category.slice(1).replace(/ /g, '-')
    const price = (formData.get('priceFrom')?.toString() || '0') + '-' + (formData.get('priceTo')?.toString() || '0')
    const query = formData.get('query')?.toString()
    const queryParams: string[] = []
    
    if(query) queryParams.push(`q=${encodeURIComponent(query)}`)
    if(category) queryParams.push(`c=${encodeURIComponent(category)}`)
    if(price !== '0-0') queryParams.push(`p=${encodeURIComponent(price)}`)

    const searchParams = queryParams.length ? '?' + queryParams.join('&') : ''
    redirect(`/products${searchParams}`)
}
