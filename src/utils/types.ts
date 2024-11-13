import { RowDataPacket } from "mysql2"

declare global {
    type Product = {
        id: number
        title: string
        description: string
        category: string
        price: number
        discountPercentage: number
        rating: number
        stock: number
        tags: string[]
        brand: string
        sku: string
        weight: number
        dimensions: {
            width: number
            height: number
            depth: number
        }
        warrantyInformation: string
        shippingInformation: string
        availabilityStatus: string
        reviews: {
            rating: number
            comment: string
            date: Date 
            reviewerName: string
            reviewerEmail: string
        }[]
        returnPolicy: string
        minimumOrderQuantity: number
        meta: {
            createdAt: Date
            updatedAt: Date
            barcode: number
            qrCode: string
        }
        images: string[]
        thumbnail: string
    }

    type User = {
        id: string
        name: string
        email: string
        isAdmin: number
    }
    type UserQuery = RowDataPacket & User

    type Order = {
        id: string
        createdAt: Date
        orderId: string
        orderItems: OrderItem[]
        status: string
        userId: string
        paymentIntentId: string
        totalPrice: number
    }

    type OrderItem = {
        id: string
        product: Product
        productId: number
        quantity: number
    }
}

export {}