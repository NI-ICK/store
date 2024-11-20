import { connectToDatabase } from "@/utils/connectToDatabase"
import { FieldPacket, RowDataPacket } from "mysql2"
import { NextRequest, NextResponse } from "next/server"

export async function GET(req: NextRequest) {
    let db
    try {
        const userId = req.nextUrl.searchParams.get('userId')

        db = await connectToDatabase()
        if(!db) return NextResponse.json({ message: "Error connecting to database" }, { status: 500 })

        const [[{ wishlist }]]: [RowDataPacket[], FieldPacket[]] = await db.query("SELECT wishlist FROM users WHERE id LIKE ?", [userId])

        return NextResponse.json({ wishlist }, { status: 200 })
    } catch(error) {
        console.log(error)
        let message = "Unknown error"
        if(error instanceof Error) message = error.message
        return NextResponse.json({ message }, { status: 500 })
    } finally {
        await db?.end()
    }
}