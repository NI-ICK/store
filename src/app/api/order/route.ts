import { connectToDatabase } from "@/utils/connectToDatabase"
import { FieldPacket, RowDataPacket } from "mysql2"
import { NextRequest, NextResponse } from "next/server"

export async function GET(req: NextRequest) {
    try {
        const orderId = req.nextUrl.searchParams.get('orderId')
        
        const db = await connectToDatabase()
        if(!db) return NextResponse.json({ message: "Error connecting to database" }, { status: 500 })

        const [query]: [RowDataPacket[], FieldPacket[]] = await db.query(
            "SELECT * FROM orders o JOIN orderItems oi ON oi.orderId = o.id WHERE o.id LIKE ?", [orderId])
        if(!query.length) return NextResponse.json({ message: "Error selecting order" }, { status: 500 })

        const orderMap: { [key: string]: any } = {}
        query.forEach(result => {
            const { orderId, ...orderItem } = result
            
            if(!orderMap[orderId]) {
                orderMap[orderId] = {
                    id: result.orderId,
                    totalPrice: result.totalPrice,
                    userId: result.userId,
                    createdAt: result.createdAt,
                    paymentIntentId: result.paymentIntentId,
                    status: result.status,
                    orderItems: []
                }
            }

            orderMap[orderId].orderItems.push({ id: orderItem.id, quantity: orderItem.quantity, productId: orderItem.productId })
        })

        const orderArray =  Object.values(orderMap)

        return NextResponse.json(orderArray[0], { status: 200 })
    } catch(error) {
        console.log(error)
        let message = "Unknown error"
        if(error instanceof Error) message = error.message
        return NextResponse.json({ message }, { status: 500 })
    }
}