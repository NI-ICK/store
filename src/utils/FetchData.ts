"use server"

import axios from "axios"
import { cookies } from "next/headers"

export const fetchAllProducts = async (page: number) => {
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

export const fetchProductCount = async () => {
    try {
        const response = await axios.get(`https://dummyjson.com/products?limit=0`)
        return response.data.total
    } catch(error) {
        console.log(error)
    }
}

//

export const fetchUser = async () => {
    try {
        const token = ((await cookies()).get('token')?.value)
        const response = await axios.get('/api/user', { headers: { Authorization: `Bearer: ${token}` }})
        return response.data
    } catch(error) {
        console.log(error)
        return null
    }
}

export const fetchUserData = async () => {
    try {
        const response = await axios.get('/api/users')
        return response.data.userData
    } catch(error) {
        console.log(error)
    }
}

export const fetchOrders = async (userId: string) => {
    try {
        const response = await axios.get('/api/orders', { params: { userId }})
        return response.data
    } catch(error) {
        console.log(error)
    }
}

export const fetchSingleOrder = async (orderId: string) => {
    try {
        const response = await axios.get('/api/order', { params: { orderId }})
        return response.data
    } catch(error) {
        console.log(error)
    }
}

export const fetchOrderCount = async () => {
    try {
        const response = await axios.get('/api/orderCount')
        return response.data.count
    } catch(error) {
        console.log(error)
    }
}

export const fetchUserCount = async () => {
    try {
        const response = await axios.get('/api/userCount')
        return response.data.count
    } catch(error) {
        console.log(error)
    }
}

export const fetchAdminData = async () => {
    try {
        const response = await axios.get('/api/data')
        return response.data
    } catch(error) {
        console.log(error)
    }
}