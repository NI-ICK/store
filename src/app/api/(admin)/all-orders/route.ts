import { connectToDatabase } from "@/utils/connectToDatabase"
import { FieldPacket, RowDataPacket } from "mysql2"
import { NextRequest, NextResponse } from "next/server"

export async function GET(req: NextRequest) {
    let db
    try {
        db = await connectToDatabase()
        if(!db) return NextResponse.json({ message: "Error connecting to database" }, { status: 500 })

        const [query]: [RowDataPacket[], FieldPacket[]] = await db.query(
            "SELECT * FROM orders o JOIN orderItems oi ON oi.orderId = o.id ORDER BY o.createdAt DESC")

        if(!query.length) return NextResponse.json({ message: "Error selecting orders" }, { status: 500 })
        
        const ordersMap: { [key: string]: any } = {}

        query.forEach((result) => {
            const { orderId, ...orderItem } = result

            if (!ordersMap[orderId]) {
                ordersMap[orderId] = {
                    id: result.orderId,
                    totalPrice: result.totalPrice,
                    totalQuantity: result.totalQuantity,
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
        let message = "Unknow error"
        if(error instanceof Error) message = error.message
        return NextResponse.json({ message }, { status: 500 })
    } finally {
        await db?.end()
    }
}   
