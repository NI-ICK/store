import { connectToDatabase } from "@/utils/connectToDatabase"
import { FieldPacket, ResultSetHeader } from "mysql2"
import { NextRequest, NextResponse } from "next/server"

export async function POST(req: NextRequest) {
    let db
    try {
        const { productId, userId } = await req.json()

        db = await connectToDatabase()
        if(!db) return NextResponse.json({ message: "Error connecting to database" }, { status: 500 })

        const [wishlist]: [ResultSetHeader, FieldPacket[]] = await db.query(
            `UPDATE users SET wishlist = 
            CASE 
                WHEN wishlist LIKE '?,%' THEN REPLACE(wishlist, '?,', '') 
                WHEN wishlist LIKE '%,?' THEN REPLACE(wishlist, ',?', '') 
                WHEN wishlist LIKE '?' THEN REPLACE(wishlist, '?', '') 
                ELSE REPLACE(wishlist, '?,', '') 
            END
            WHERE id LIKE ?`,
            [productId, productId, productId, productId, productId, productId, productId, userId])
        if(wishlist.affectedRows === 0) return NextResponse.json({ message: "Error removing item from wishlist" }, { status: 500 })

        return NextResponse.json({ message: "Successfully removed item from wishlist" }, { status: 200 })
    } catch(error) {
        console.log(error)
        let message = "Unknown error"
        if(error instanceof Error) message = error.message
        return NextResponse.json({ message }, { status: 500 })
    } finally {
        await db?.end()
    }
}