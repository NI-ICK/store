import { connectToDatabase } from "@/utils/connectToDatabase"
import { FieldPacket, RowDataPacket } from "mysql2"
import { NextResponse } from "next/server"

export async function GET() {
    let db
    try {
        db = await connectToDatabase()
        if(!db) return NextResponse.json({ message: "Error connecting to database" }, { status: 500 })

        const [statusData]: [RowDataPacket[], FieldPacket[]] = await db.query("SELECT status, COUNT(*) as statusCount FROM orders GROUP BY status")

        const [[{ totalOrderPrice }]]: [RowDataPacket[], FieldPacket[]] = await db.query("SELECT SUM(totalPrice) as totalOrderPrice FROM orders")

        const [[{ orderCount }]]: [RowDataPacket[], FieldPacket[]] = await db.query("SELECT COUNT(*) as orderCount FROM orders")

        const [[{ userCount }]]: [RowDataPacket[], FieldPacket[]] = await db.query("SELECT COUNT(*) as userCount FROM users")

        const [[{ adminUserCount }]]: [RowDataPacket[], FieldPacket[]] = await db.query("SELECT COUNT(*) as adminUserCount FROM users WHERE isAdmin LIKE 1")

        return NextResponse.json({ totalOrderPrice: totalOrderPrice && totalOrderPrice.toFixed(2), orderCount, userCount, statusData, adminUserCount }, { status: 200 })
    } catch(error) {
        console.log(error)
        let message = "Unknown error"
        if(error instanceof Error) message = error.message
        return NextResponse.json({ message }, { status: 500 })
    } finally {
        await db?.end()
    }
}