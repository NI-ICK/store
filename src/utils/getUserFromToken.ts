"use server"

import { cookies } from "next/headers"
import { jwtVerify } from "jose"

export async function getUserFromToken() {
    const token = (await cookies()).get('token')?.value
    if(!token) return null

    const secret = new TextEncoder().encode(process.env.JWT_SECRET)
    const { payload } = await jwtVerify(token, secret, { algorithms: ['HS256'] })
    if(!payload) return null

    return payload as UserPayload
}