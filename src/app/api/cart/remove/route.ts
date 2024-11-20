import { connectToDatabase } from "@/utils/connectToDatabase"
import { FieldPacket, ResultSetHeader, RowDataPacket } from "mysql2"
import { NextRequest, NextResponse } from "next/server"

export async function POST(req: NextRequest) {
    let db
    try {
        const { productId, userId } = await req.json()

        db = await connectToDatabase()
        if(!db) return NextResponse.json({ message: "Error connecting to database" }, { status: 500 })

        const [[{ quantity }]]: [RowDataPacket[], FieldPacket[]] = await db.query(
            "SELECT SUBSTRING_INDEX(SUBSTRING_INDEX(cart, '?x', -1), ',', 1) AS quantity FROM users WHERE id LIKE ?", 
            [productId, userId])
        if(!quantity) return NextResponse.json({ message: "Error selecting quantity" }, { status: 500 })

        const [cart]: [ResultSetHeader, FieldPacket[]] = await db.query(
            `UPDATE users SET cart = 
            CASE 
                WHEN cart LIKE '?x?,%' THEN REPLACE(cart, '?x?,', '') 
                WHEN cart LIKE '%,?x?' THEN REPLACE(cart, ',?x?', '') 
                WHEN cart LIKE '?x?' THEN REPLACE(cart, '?x?', '') 
                ELSE REPLACE(cart, '?x?,', '') 
            END
            WHERE id LIKE ?`,
            [productId, Number(quantity), productId, Number(quantity), productId, Number(quantity), productId, Number(quantity), productId, Number(quantity), productId, Number(quantity), productId, Number(quantity), userId])
        if(cart.affectedRows === 0) return NextResponse.json({ message: "Error removing item from cart" }, { status: 500 })

        return NextResponse.json({ message: "Successfully removed item from cart" }, { status: 200 })
    } catch(error) {
        console.log(error)
        let message = "Unknown error"
        if(error instanceof Error) message = error.message
        return NextResponse.json({ message }, { status: 500 })
    } finally {
        await db?.end()
    }
}