import { connectToDatabase } from "@/utils/connectToDatabase"
import { stripe } from "@/utils/stripe"
import { FieldPacket, ResultSetHeader, RowDataPacket } from "mysql2"
import { NextRequest, NextResponse } from "next/server"

type OrdersMap = {
    id: string
    createdAt: Date
    orderItems: OrdersItemMap[]
    status: string
    userId: string
    totalPrice: number
    totalQuantity: number
}

type OrdersItemMap = {
    id: string
    productId: number
    quantity: number
}

export async function GET(req: NextRequest) {
    let db
    try {
        const userId = req.nextUrl.searchParams.get('userId')

        db = await connectToDatabase()
        if(!db) return NextResponse.json({ message: "Error connecting to database" }, { status: 500 })

        const [query]: [RowDataPacket[], FieldPacket[]] = await db.query(
            "SELECT * FROM orders o JOIN orderItems oi ON oi.orderId = o.id WHERE o.userId LIKE ? ORDER BY o.createdAt DESC", [userId])

        if(!query.length) return NextResponse.json({ message: "Error selecting orders" }, { status: 500 })
        
        const ordersMap: { [key: string]: OrdersMap } = {}

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
        let message = "Unknown error"
        if(error instanceof Error) message = error.message
        return NextResponse.json({ message }, { status: 500 })
    } finally {
        await db?.end()
    }
}   

export async function PUT(req: NextRequest) {
    let db
    try {
        const { orderId, paymentIntentId } = await req.json()

        db = await connectToDatabase()
        if(!db) return NextResponse.json({ message: "Error connecting to database" }, { status: 500 })

        await db.beginTransaction()

        const [query]: [ResultSetHeader, FieldPacket[]] = await db.query("UPDATE orders SET status = 'Refunded' WHERE id LIKE ?", [orderId])
        if(query.affectedRows === 0) return NextResponse.json({ message: "Error updating order status" }, { status: 500 })

        const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId)
        const refund = await stripe.refunds.create({ charge: paymentIntent.latest_charge as string })
        if(!refund) {
            await db.rollback()
            return NextResponse.json({ message: "Refund failed" }, { status: 500 })
        }

        await db.commit()
        return NextResponse.json({ message: "Order refunded" }, { status: 200 })
    } catch(error) {
        console.log(error)
        let message = "Unknown error"
        if(error instanceof Error) message = error.message
        return NextResponse.json({ message }, { status: 500 })
    } finally {
        await db?.end()
    }
}