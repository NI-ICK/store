import { NextRequest, NextResponse } from "next/server"
import bcrypt from 'bcrypt'
import { connectToDatabase } from "@/utils/connectToDatabase"
import { FieldPacket, ResultSetHeader } from "mysql2"
import { randomUUID } from "crypto"

export async function POST(req: NextRequest) {
    try {
        const { name, email, password } = await req.json()
        const hashedPassword = await bcrypt.hash(password, 10)
        
        const db = await connectToDatabase()
        if(!db) return NextResponse.json({ message: "Error connecting to database" }, { status: 500 })
            
        const [existingUser]: [UserQuery[], FieldPacket[]] = await db.query("SELECT id FROM users WHERE email LIKE ?", [email])
        if(existingUser.length > 0) return NextResponse.json({ message: "User with that email already exists" }, { status: 409 })

        const [query]: [ResultSetHeader, FieldPacket[]] = await db.query(`INSERT INTO users (id, name, email, password) VALUES(?, ?, ?, ?)`, [randomUUID(), name, email, hashedPassword])
        if(query.affectedRows === 0) return NextResponse.json({ message: "Error registering" }, { status: 500 })
            
        return NextResponse.json({ message: 'Registered successfully'}, { status: 200 })
    } catch(error) {
        let message = "Unknown error"
        if(error instanceof Error) message = error.message
        console.log(message)
        return NextResponse.json({ message }, { status: 500 })
    }
}
