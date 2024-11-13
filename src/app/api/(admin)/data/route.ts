import { connectToDatabase } from "@/utils/connectToDatabase"
import { FieldPacket, RowDataPacket } from "mysql2"
import { NextResponse } from "next/server"

export async function GET() {
    let db
    try {
        db = await connectToDatabase()
        if(!db) return NextResponse.json({ message: "Error connecting to database" }, { status: 500 })

        const [statusData]: [RowDataPacket[], FieldPacket[]] = await db.query("SELECT status, COUNT(*) as statusCount FROM orders GROUP BY status")
        if(!statusData.length) return NextResponse.json({ message: "Error selecting orders status" }, { status: 500 })

        const [[{ totalOrderPrice }]]: [RowDataPacket[], FieldPacket[]] = await db.query("SELECT SUM(totalPrice) as totalOrderPrice FROM orders")
        if(!totalOrderPrice) return NextResponse.json({ message: "Error selecting total order price" }, { status: 500 })

        const [[{ orderCount }]]: [RowDataPacket[], FieldPacket[]] = await db.query("SELECT COUNT(*) as orderCount FROM orders")
        if(!orderCount) return NextResponse.json({ message: "Error selecting orders count" }, { status: 500 })

        const [[{ userCount }]]: [RowDataPacket[], FieldPacket[]] = await db.query("SELECT COUNT(*) as userCount FROM users")
        if(!userCount) return NextResponse.json({ message: "Error selecting users count" }, { status: 500 })

        const [[{ adminUserCount }]]: [RowDataPacket[], FieldPacket[]] = await db.query("SELECT COUNT(*) as adminUserCount FROM users WHERE isAdmin LIKE 1")
        if(!adminUserCount) return NextResponse.json({ message: "Error selecting users count" }, { status: 500 })
        
    return NextResponse.json({ totalOrderPrice, orderCount, userCount, statusData, adminUserCount }, { status: 200 })
    } catch(error) {
        console.log(error)
        let message = "Unknown error"
        if(error instanceof Error) message = error.message
        return NextResponse.json({ message }, { status: 500 })
    } finally {
        await db?.end()
    }
}