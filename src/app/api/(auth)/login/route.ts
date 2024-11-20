import { connectToDatabase } from "@/utils/connectToDatabase"
import { FieldPacket } from "mysql2"
import { NextRequest, NextResponse } from "next/server"
import bcrypt from 'bcrypt'
import { cookies } from "next/headers"
import { SignJWT } from "jose"

export async function POST(req: NextRequest) {
    let db
    try {
        const { email, password } = await req.json()

        db = await connectToDatabase()
        if(!db) return NextResponse.json({ message: "Error connecting to database" }, { status: 500 })

        const [user]: [UserQuery[], FieldPacket[]] = await db.query("SELECT * FROM users WHERE email LIKE ?", [email])
        if(!user.length) return NextResponse.json({ message: "User does not exist" }, { status: 401 })
        
        const validPassword = await bcrypt.compare(password, user[0].password)
        if(!validPassword) return NextResponse.json({ message: "Invalid Password" }, { status: 401 })

        const secret = new TextEncoder().encode(process.env.JWT_SECRET)
        const token = await new SignJWT({ id: user[0].id, name: user[0].name, isAdmin: user[0].isAdmin })
            .setProtectedHeader({ alg: "HS256"})
            .setExpirationTime("10h")
            .sign(secret);
        (await cookies()).set({
            name: 'token',
            value: token,
            sameSite: 'strict',
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            path: '/',
            maxAge: 60 * 60 * 10 // 10h
        })
        return NextResponse.json({ message: "Login successfull" }, { status: 200 })
    } catch(error) {
        let message = "Unknown error"
        if(error instanceof Error) message = error.message
        return NextResponse.json({ message }, { status: 500 })
    } finally {
        await db?.end()
    }
}