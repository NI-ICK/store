import axios from "axios"

export const fetchAllProducts = async () => {
    try {
        const response = await axios.get('https://dummyjson.com/products')
        return response.data.products
    } catch(error) {
        let message = "Unknown Error"
        if(error instanceof Error) message = error.message
        console.log("Error fetching products: ", message)
    }
}

export const fetchProductsByCategory = async (category: string) => {
    try {
        const response = await axios.get(`https://dummyjson.com/products/category/${category}`)
        return response.data.products
    } catch(error) {
        let message = "Unknown Error"
        if(error instanceof Error) message = error.message
        console.log("Error fetching products: ", message)
    }
}

export const fetchProductsByQuery = async (query: string) => {
    try {
        const response = await axios.get(`https://dummyjson.com/products/search?q=${query}`)
        return response.data.products
    } catch(error) {
        let message = "Unknown Error"
        if(error instanceof Error) message = error.message
        console.log("Error fetching products: ", message)
    }
}

export const fetchCategories = async () => {
    try {
        const response = await axios.get('https://dummyjson.com/products/category-list')
        return response.data.map((category: string) => {
            return category[0].toUpperCase() + category.slice(1).replace(/-/g, ' ')
        })
    } catch(error) {
        let message = "Unknown Error"
        if(error instanceof Error) message = error.message
        console.log("Error fetching categories: ", message)
    }
}