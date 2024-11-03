import axios from "axios"

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

export const api = axios.create({ baseURL: process.env.API_URL })

export const fetchUser = async (token: string) => {
    try {
        const response = await api.get('/api/user', { headers: { Authorization: `Bearer: ${token}` }})
        return response.data
    } catch(error) {
        let message = "Unknown error"
        if(error instanceof Error) message = error.message
        console.log("Error fetching user: ", message)
    }
}