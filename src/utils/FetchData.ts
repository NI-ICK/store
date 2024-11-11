"use server"

import axios from "axios"
import { cookies } from "next/headers"

export const fetchAllProducts = async (page: number) => {
    try {
        page = page - 1
        const response = await axios.get(`https://dummyjson.com/products?skip=${page * 30}`)
        return response.data
    } catch(error) {
        let message = "Unknown Error"
        if(error instanceof Error) message = error.message
        console.log("Error fetching products: ", message)
    }
}

export const fetchSingleProduct = async (id: number) => {
    try {
        const response = await axios.get(`https://dummyjson.com/products/${id}`)
        return response.data
    } catch(error) {
        let message = "Unknown Error"
        if(error instanceof Error) message = error.message
        console.log("Error fetching product: ", message)
    }
}

export const fetchProductsByCategory = async (category: string, page?: number) => {
    try {
        if(page) page = page - 1
        const response = await axios.get(`https://dummyjson.com/products/category/${category}${page ? `?skip=${page * 30}` : ''}`)
        return page !== undefined ? { products: response.data.products, total: response.data.total } : response.data.products
    } catch(error) {
        let message = "Unknown Error"
        if(error instanceof Error) message = error.message
        console.log("Error fetching products: ", message)
    }
}

export const fetchProductsByQuery = async (query: string, page: number) => {
    try {
        page = page - 1
        const response = await axios.get(`https://dummyjson.com/products/search?q=${query}&skip=${page * 30}`)
        return response.data
    } catch(error) {
        let message = "Unknown Error"
        if(error instanceof Error) message = error.message
        console.log("Error fetching products: ", message)
    }
}

export const fetchCategories = async () => {
    try {
        const response = await axios.get('https://dummyjson.com/products/category-list')
        return response.data
    } catch(error) {
        let message = "Unknown Error"
        if(error instanceof Error) message = error.message
        console.log("Error fetching categories: ", message)
    }
}

//

export const fetchUser = async () => {
    try {
        const token = ((await cookies()).get('token')?.value)
        const response = await axios.get('/api/user', { headers: { Authorization: `Bearer: ${token}` }})
        return response.data
    } catch(error) {
        let message = "Unknown error"
        if(error instanceof Error) message = error.message
        console.log("Error fetching user: ", message)
    }
}

export const fetchOrders = async (userId: string) => {
    try {
        const response = await axios.get('/api/orders', { params: { userId }})
        return response.data
    } catch(error) {
        let message = "Unknown error"
        if(error instanceof Error) message = error.message
        console.log("Error fetching orders: ", message)
    }
}

export const fetchSingleOrder = async (orderId: string) => {
    try {
        const response = await axios.get('/api/order', { params: { orderId }})
        return response.data
    } catch(error) {
        console.log(error)
        let message = "Unknown error"
        if(error instanceof Error) message = error.message
        console.log("Error fetching order: ", message)
    }
}