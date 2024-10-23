import axios from "axios"

export const fetchAllProducts = async (page: number) => {
    try {
        return await axios.get(`https://dummyjson.com/products?skip=${page * 30}`)
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

export const fetchProductsByCategory = async (category: string, page: number) => {
    try {
        return await axios.get(`https://dummyjson.com/products/category/${category}?skip=${page * 30}`)
    } catch(error) {
        let message = "Unknown Error"
        if(error instanceof Error) message = error.message
        console.log("Error fetching products: ", message)
    }
}

export const fetchProductsByQuery = async (query: string, page: number) => {
    try {
        return await axios.get(`https://dummyjson.com/products/search?q=${query}&skip=${page * 30}`)
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