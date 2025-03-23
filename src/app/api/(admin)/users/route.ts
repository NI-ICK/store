import { connectToDatabase } from "@/utils/connectToDatabase"
import { FieldPacket, RowDataPacket } from "mysql2"
import { NextResponse } from "next/server"

export async function GET() {
    let db
    try {
        db = await connectToDatabase()
        if(!db) return NextResponse.json({ message: "Error connecting to database" }, { status: 500 })

        const [users]: [RowDataPacket[], FieldPacket[]] = await db.query("SELECT * FROM users")
        if(!users.length) return NextResponse.json({ message: "Error selecting users" }, { status: 500 })

        const [userOrders]: [RowDataPacket[], FieldPacket[]] = await db.query("SELECT userId, COUNT(*) as userOrders FROM orders GROUP BY userId")
        if(!userOrders.length) return NextResponse.json({ message: "Error selecting user order count" }, { status: 500 })

        const orderCountMap: { [key: number]: number } = {}
        userOrders.forEach(order => {
            orderCountMap[order.userId] = order.userOrders
        })

        const userData = users.map(user => ({
            ...user, userOrders: orderCountMap[user.id] || 0
        }))

        return NextResponse.json({ userData }, { status: 200 })
    } catch(error) {
        console.log(error)
        let message = "Unknown error"
        if(error instanceof Error) message = error.message
        return NextResponse.json({ message }, { status: 500 })
    } finally {
        await db?.end()
    }
}