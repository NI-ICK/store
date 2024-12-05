import { connectToDatabase } from "@/utils/connectToDatabase"
import { FieldPacket, RowDataPacket } from "mysql2"
import { NextResponse } from "next/server"

type OrdersMap = {
    id: string
    createdAt: Date
    orderItems: OrdersItemMap[]
    status: string
    userId: string
    totalPrice: number
    paymentIntentId: string
}

type OrdersItemMap = {
    id: string
    productId: number
    quantity: number
}

export async function GET() {
    let db
    try {
        db = await connectToDatabase()
        if(!db) return NextResponse.json({ message: "Error connecting to database" }, { status: 500 })

        const [query]: [RowDataPacket[], FieldPacket[]] = await db.query(
            "SELECT * FROM orders o JOIN orderItems oi ON oi.orderId = o.id ORDER BY o.createdAt DESC")
        
        const ordersMap: { [key: string]: OrdersMap } = {}

        query.forEach((result) => {
            const { orderId, ...orderItem } = result

            if (!ordersMap[orderId]) {
                ordersMap[orderId] = {
                    id: result.orderId,
                    totalPrice: result.totalPrice,
                    paymentIntentId: result.paymentIntentId,
                    userId: result.userId,
                    createdAt: result.createdAt,
                    status: result.status,
                    orderItems: []
                }
            }

            ordersMap[orderId].orderItems.push({ id: orderItem.id, quantity: orderItem.quantity, productId: orderItem.productId })
        })

        const ordersArray = Object.values(ordersMap)

        return NextResponse.json({ orders: ordersArray }, { status: 200 })
    } catch(error) {
        console.log(error)
        let message = "Unknown error"
        if(error instanceof Error) message = error.message
        return NextResponse.json({ message }, { status: 500 })
    } finally {
        await db?.end()
    }
}   
