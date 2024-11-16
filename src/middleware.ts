import { fetchUser } from "@/utils/fetchData"
import { NextRequest, NextResponse } from "next/server"

export default async function middleware(req: NextRequest) {
    const user = await fetchUser(true)

    if(!user) return NextResponse.redirect(new URL('/404', req.nextUrl))
    
    if(!user.isAdmin && req.nextUrl.pathname.startsWith('/admin')) return NextResponse.redirect(new URL('/404', req.nextUrl))

    return NextResponse.next()
}

export const config = {
    matcher: [ '/cart', '/wishlist', '/settings', '/orders', '/admin', '/admin/:path' ]
}