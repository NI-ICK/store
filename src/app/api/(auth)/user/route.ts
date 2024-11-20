import { NextRequest, NextResponse } from "next/server"
import { connectToDatabase } from "@/utils/connectToDatabase"
import { FieldPacket, ResultSetHeader } from "mysql2"
import { cookies } from "next/headers"
import bcrypt from 'bcrypt'
import { jwtVerify } from "jose"

export async function GET(req: NextRequest) {
    let db
    try {
        const token = req.headers.get('Authorization')?.split(' ')[1]
        if(!token) return NextResponse.json({ message: "Unauthorized" }, { status: 401 })

        const secret = new TextEncoder().encode(process.env.JWT_SECRET)
        const { payload } = await jwtVerify(token, secret, { algorithms: ["HS256"] })
        if(!payload) return NextResponse.json({ message: "Invalid token" }, { status: 401 })

        db = await connectToDatabase()
        if(!db) return NextResponse.json({ message: "Error connecting to database" }, { status: 500 })

        const [user]: [UserQuery[], FieldPacket[]] = await db.query("SELECT id, name, email, isAdmin FROM users WHERE id LIKE ?", [payload.id]) 
        if(!user.length) return NextResponse.json({ message: "User not found" }, { status: 404 })
            
        return NextResponse.json(user[0], { status: 200 })
    } catch(error) {
        let message = "Unknown error"
        if(error instanceof Error) message = error.message
        console.log(message)
        return NextResponse.json({ message }, { status: 500 })
    } finally {
        await db?.end()
    }
}

export async function PUT(req: NextRequest) {
    let db
    try {
        const { name, email, password, id } = await req.json()
        let hashedPassword = ''

        db = await connectToDatabase()
        if(!db) return NextResponse.json({ message: "Error connecting to database" }, { status: 500 })

        const fields = []
        const values = []

        if(password) hashedPassword = await bcrypt.hash(password, 10)

        if(name) {
            fields.push('name = ?')
            values.push(name)
        }
    
        if(email) {
            fields.push('email = ?')
            values.push(email)
        }
    
        if(hashedPassword) {
            fields.push('password = ?')
            values.push(hashedPassword)
        }
        
        const [query]: [ResultSetHeader, FieldPacket[]] = await db.query(`UPDATE users SET ${fields.join(', ')} WHERE id LIKE ?`, [ ...values, id ])
        if(query.affectedRows === 0) return NextResponse.json({ message: "Error updating user" }, { status: 500 })

        return NextResponse.json({ message: "User updated succesfully" }, { status: 200 }) 
    } catch(error) {
        let message = "Unknown error"
        if(error instanceof Error) message = error.message
        console.log(message)
        return NextResponse.json({ message }, { status: 500 })
    } finally {
        await db?.end()
    }
}

export async function DELETE(req: NextRequest) {
    let db
    try {
        const { userId } = await req.json()

        db = await connectToDatabase()
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
    } finally {
        await db?.end()
    }
}