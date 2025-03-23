"use server"

import axios, { AxiosError } from "axios"

export const fetchAllProductsByPage = async (page: number) => {
    try {
        page = page - 1
        const response = await axios.get(`https://dummyjson.com/products?skip=${page * 30}`)
        return response.data
    } catch(error) {
        console.log(error)
    }
}

export const fetchSingleProduct = async (id: number) => {
    try {
        if(!id) return
        const response = await axios.get(`https://dummyjson.com/products/${id}`)
        return response.data
    } catch(error) {
        console.log(error)
    }
}

export const fetchProductsByCategory = async (category: string, page?: number) => {
    try {
        if(page) page = page - 1
        const response = await axios.get(`https://dummyjson.com/products/category/${category}${page ? `?skip=${page * 30}` : ''}`)
        return page !== undefined ? { products: response.data.products, total: response.data.total } : response.data.products
    } catch(error) {
        console.log(error)
    }
}

export const fetchProductsByQuery = async (query: string, page: number) => {
    try {
        page = page - 1
        const response = await axios.get(`https://dummyjson.com/products/search?q=${query}&skip=${page * 30}`)
        return response.data
    } catch(error) {
        console.log(error)
    }
}

export const fetchCategories = async () => {
    try {
        const response = await axios.get('https://dummyjson.com/products/category-list')
        return response.data
    } catch(error) {
        console.log(error)
    }
}

export const fetchAllProducts = async () => {
    try {
        const response = await axios.get(`https://dummyjson.com/products?limit=0`)
        return response.data.products
    } catch(error) {
        console.log(error)
    }
}

//

export const fetchUserData = async () => {
    try {
        const response = await axios.get('/api/users')
        return response.data.userData
    } catch(error) {
        let message = "Unknown error"
        if(error instanceof AxiosError) message = error.message
        console.log(message)
        console.log(error)
    }
}

export const fetchUserOrders = async (userId: string) => {
    try {
        const response = await axios.get('/api/orders', { params: { userId }})
        return response.data
    } catch(error) {
        let message = "Unknown error"
        if(error instanceof AxiosError) message = error.message
        console.log(message)
    }
}

export const fetchAllOrders = async () => {
    try {
        const response = await axios.get('/api/all-orders')
        return response.data
    } catch(error) {
        let message = "Unknown error"
        if(error instanceof AxiosError) message = error.message
        console.log(error)
    }
}

export const fetchSingleOrder = async (orderId: string) => {
    try {
        const response = await axios.get('/api/order', { params: { orderId }})
        return response.data
    } catch(error) {
        let message = "Unknown error"
        if(error instanceof AxiosError) message = error.message
        console.log(message)
    }
}

export const fetchAdminData = async () => {
    try {
        const response = await axios.get('/api/data')
        return response.data
    } catch(error) {
        let message = "Unknown error"
        if(error instanceof AxiosError) message = error.message
        console.log(message)
        console.log(error)
        return null
    }
}