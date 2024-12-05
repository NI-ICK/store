import { NextRequest, NextResponse } from "next/server"
import { getUserFromToken } from "./utils/getUserFromToken"

export default async function middleware(req: NextRequest) {
    const routes = [ '/cart', '/wishlist', '/settings', '/orders', '/admin', '/admin/orders', '/admin/products', '/admin/users' ]

    if(routes.includes(req.nextUrl.pathname)) {
        const user = await getUserFromToken()
    
        if(!user) return NextResponse.redirect(new URL('/404', req.nextUrl))

        if(!user.isAdmin && req.nextUrl.pathname.startsWith('/admin')) return NextResponse.redirect(new URL('/404', req.nextUrl))
    }
    return NextResponse.next()
}