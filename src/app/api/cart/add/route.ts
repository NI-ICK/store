import { connectToDatabase } from "@/utils/connectToDatabase"
import { FieldPacket, ResultSetHeader } from "mysql2"
import { NextRequest, NextResponse } from "next/server"

export async function POST(req: NextRequest) {
    let db
    try {
        const { productId, userId } = await req.json()

        db = await connectToDatabase()
        if(!db) return NextResponse.json({ message: "Error connecting to database" }, { status: 500 })

        const [cartUpdate]: [ResultSetHeader, FieldPacket[]] = await db.query(
            `UPDATE users SET cart = 
            CASE 
                WHEN cart IS NULL OR cart = '' THEN '?x1'
                ELSE CONCAT(cart, ',', '?x1') 
            END 
            WHERE id LIKE ?`, 
            [productId, productId, userId])
            console.log(cartUpdate)
        if(cartUpdate.affectedRows === 0) return NextResponse.json({ message: "Error adding item to cart" }, { status: 500 })

        return NextResponse.json({ message: "Successfully added item to cart" }, { status: 200 })
    } catch(error) {
        console.log(error)
        let message = "Unknown error"
        if(error instanceof Error) message = error.message
        return NextResponse.json({ message }, { status: 500 })
    } finally {
        await db?.end()
    }
}