import { connectToDatabase } from "@/utils/connectToDatabase"
import { stripe } from "@/utils/stripe"
import { randomUUID } from "crypto"
import { FieldPacket, ResultSetHeader } from "mysql2"
import { NextRequest, NextResponse } from "next/server"

export async function POST(req: NextRequest) {
    let db
    try {
        const event = stripe.webhooks.constructEvent(
            await req.text(),
            req.headers.get("stripe-signature")!,
            process.env.STRIPE_WEBHOOK_SECRET!
        )

        if(event.type === 'checkout.session.completed') {
            const metadata = event.data.object.metadata
            if(!metadata) return NextResponse.json({ message: "No metadata provided" }, { status: 500 })

            const userId = metadata.userId
            const totalPrice = event.data.object.amount_total! / 100
            const paymentIntentId = event.data.object.payment_intent

            db = await connectToDatabase()
            if(!db) return NextResponse.json({ message: "Error connecting to database" }, { status: 500 })

            await db.beginTransaction()
        
            const orderId = randomUUID()
            const [order]: [ResultSetHeader, FieldPacket[]] = await db.query(
                "INSERT INTO orders (id, userId, totalPrice, paymentIntentId) VALUES(?, ?, ?, ?)",
                [orderId, userId, totalPrice, paymentIntentId])
                 
            if(order.affectedRows === 0) {
                await db.rollback()
                return NextResponse.json({ message: "Error adding order to database" }, { status: 500 })
            }

            for(let i = 0; i < (Object.keys(metadata).length - 2) / 2; i++) {
                const productId = Number(metadata[`product_${i}_id`])
                const quantity = Number(metadata[`product_${i}_quantity`])

                const [orderItem]: [ResultSetHeader, FieldPacket[]] = await db.query(
                    "INSERT INTO orderItems (id, productId, quantity, orderId) VALUES(?, ?, ?, ?)", 
                    [randomUUID(), productId, quantity, orderId])
                if(orderItem.affectedRows === 0) {
                    await db.rollback()
                    return NextResponse.json({ message: "Error adding orderItem to database" }, { status: 500 })
                }
            }
            await db.commit()
            return NextResponse.json({ message: "Order successfull" }, { status: 200 })
        }
        return NextResponse.json({ message: "Event received successfully" }, { status: 200 })
    } catch(error) {
        console.log(error)
        let message = "Unknown error"
        if(error instanceof Error) message = error.message
        return NextResponse.json({ message }, { status: 500 })
    } finally {
        await db?.end()
    }
}