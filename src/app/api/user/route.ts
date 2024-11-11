import { NextRequest, NextResponse } from "next/server"
import jwt, { JwtPayload } from 'jsonwebtoken'
import { connectToDatabase } from "@/utils/connectToDatabase"
import { FieldPacket, ResultSetHeader } from "mysql2"
import { cookies } from "next/headers"
import bcrypt from 'bcrypt'

export async function GET(req: NextRequest) {
    try {
        const token = req.headers.get('Authorization')?.split(' ')[1]
        if(!token) return NextResponse.json({ message: "Unauthorized" }, { status: 401 })

        const validToken = jwt.verify(token, `${process.env.JWT_SECRET}`) as JwtPayload
        if(!validToken) return NextResponse.json({ message: "Invalid token" }, { status: 401 })

        const db = await connectToDatabase()
        if(!db) return NextResponse.json({ message: "Error connecting to database" }, { status: 500 })

        const [user]: [UserQuery[], FieldPacket[]] = await db.query("SELECT id, name, email, isAdmin FROM users WHERE id LIKE ?", [validToken.id]) 
        if(!user.length) return NextResponse.json({ message: "User not found" }, { status: 404 })
            
        return NextResponse.json(user[0], { status: 200 })
    } catch(error) {
        let message = "Unknown error"
        if(error instanceof Error) message = error.message
        console.log(message)
        return NextResponse.json({ message }, { status: 500 })
    }
}

export async function PUT(req: NextRequest) {
    try {
        const { name, email, password, id } = await req.json()
        let hashedPassword = ''

        const db = await connectToDatabase()
        if(!db) return NextResponse.json({ message: "Error connecting to database" }, { status: 500 })

        const fields = []
        const values = []

        if(password) hashedPassword = await bcrypt.hash(password, 10)

        if(name) fields.push('name = ?'), values.push(name)
        if(email) fields.push('email = ?'), values.push(email)
        if(hashedPassword) fields.push('password = ?'), values.push(hashedPassword)

        const [query]: [ResultSetHeader, FieldPacket[]] = await db.query(`UPDATE users SET ${fields.join(', ')} WHERE id LIKE ?`, [ ...values, id ])
        if(query.affectedRows === 0) return NextResponse.json({ message: "Error updating user" }, { status: 500 })

        return NextResponse.json({ message: "User updated succesfully" }, { status: 200 }) 
    } catch(error) {
        let message = "Unknown error"
        if(error instanceof Error) message = error.message
        console.log(message)
        return NextResponse.json({ message }, { status: 500 })
    }
}

export async function DELETE(req: NextRequest) {
    try {
        const { userId } = await req.json()

        const db = await connectToDatabase()
        if(!db) return NextResponse.json({ message: "Error connecting to database" }, { status: 500 })

        const [query]: [ResultSetHeader, FieldPacket[]] = await db.query('DELETE FROM users WHERE id LIKE ?', [userId])
        if(query.affectedRows === 0) return NextResponse.json({ message: "Error removing user" }, { status: 500 });
        
        (await cookies()).delete('token')
        return NextResponse.json({ message: "User removed succesfully" }, { status: 200 })
    } catch(error) {
        let message = "Unknown error"
        if(error instanceof Error) message = error.message
        console.log(message)
        return NextResponse.json({ message }, { status: 500 })
    }
}