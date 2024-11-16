"use client"

import { useCartStore } from "@/store/useCartStore"
import { useEffect } from "react"

type Data = {
    id: number
    quantity: number
}

export const ClearCart = ({ orders }: { orders: Order[] }) => {
    const cartItems = useCartStore(state => state.cartItems)
    const emptyCartItems = useCartStore(state => state.emptyCartItems)
    const cartItemsData = cartItems.map(item => { return { id: item.id, quantity: item.quantity }})
    const ordersData = orders.map(order =>
        order.orderItems.map(item => ({ id: item.product.id, quantity: item.quantity }))
    )
    
    const isInArray = (item: Data, array: Data[]) => {
        return array.some(i => i.id === item.id && i.quantity === item.quantity)
    }

    const checkMatch = (array1: Data[], array2: Array<Data[]>) => {
        return array1.every(item => array2.some(subArray => isInArray(item, subArray)))
    }

    useEffect(() => {
        const matches = checkMatch(cartItemsData, ordersData)
        if(matches) emptyCartItems()
    }, [])

    return null
}