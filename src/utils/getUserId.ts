"use server"

import { cookies } from "next/headers"
import jwt, { JwtPayload } from 'jsonwebtoken'

export async function getUserId() {
    const token = (await cookies()).get('token')?.value
    if(!token) return null
    
    const validToken = jwt.verify(token, `${process.env.JWT_SECRET}`) as JwtPayload

    return validToken.id
}